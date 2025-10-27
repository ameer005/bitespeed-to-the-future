import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { LinkPrecedence } from "../generated/prisma/enums";
import { Contact } from "../generated/prisma/client";
import { isValidEmail, isValidPhoneNumber } from "../utils";

export const identifyCustomer = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({
        message:
          "Flux capacitor needs input — provide an email or phone number.",
      });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format detected — please check your input.",
      });
    }

    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        message: "Invalid phone number format — must contain digits only.",
      });
    }

    const matchedContacts = await prisma.contact.findMany({
      where: {
        OR: [{ phoneNumber }, { email }],
      },
      orderBy: { createdAt: "asc" },
    });

    if (matchedContacts.length === 0) {
      const newContact = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: LinkPrecedence.PRIMARY,
        },
      });
      return sendResponse(res, newContact, [newContact]);
    }

    const primaryContact =
      matchedContacts.find(
        (c) => c.linkPrecedence === LinkPrecedence.PRIMARY,
      ) ?? matchedContacts[0];

    await demoteExtraPrimaries(matchedContacts, primaryContact.id);

    await createMissingSecondaryIfNeeded(matchedContacts, primaryContact, {
      email,
      phoneNumber,
    });

    const allLinkedContacts: Contact[] = await prisma.contact.findMany({
      where: {
        OR: [{ id: primaryContact.id }, { linkedId: primaryContact.id }],
      },
    });

    return sendResponse(res, primaryContact, allLinkedContacts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

async function demoteExtraPrimaries(
  contacts: Contact[],
  primaryId: number,
): Promise<void> {
  const extraPrimaries = contacts.filter(
    (c) => c.id !== primaryId && c.linkPrecedence === LinkPrecedence.PRIMARY,
  );

  await Promise.all(
    extraPrimaries.map((contact) =>
      prisma.contact.update({
        where: { id: contact.id },
        data: {
          linkedId: primaryId,
          linkPrecedence: LinkPrecedence.SECONDARY,
        },
      }),
    ),
  );
}

async function createMissingSecondaryIfNeeded(
  contacts: Contact[],
  primary: Contact,
  { email, phoneNumber }: { email?: string; phoneNumber?: string },
): Promise<void> {
  const alreadyExists = contacts.some(
    (c) => c.email === email && c.phoneNumber === phoneNumber,
  );

  if (alreadyExists) return;

  await prisma.contact.create({
    data: {
      email,
      phoneNumber,
      linkPrecedence: LinkPrecedence.SECONDARY,
      linkedId: primary.id,
    },
  });
}

function sendResponse(
  res: Response,
  primary: Contact,
  contacts: Contact[],
): Response {
  const emails = [...new Set(contacts.map((c) => c.email).filter(Boolean))];
  const phoneNumbers = [
    ...new Set(contacts.map((c) => c.phoneNumber).filter(Boolean)),
  ];
  const secondaryIds = contacts
    .filter((c) => c.linkPrecedence === LinkPrecedence.SECONDARY)
    .map((c) => c.id);

  return res.status(200).json({
    contact: {
      primaryContactId: primary.id,
      emails,
      phoneNumbers,
      secondaryContactIds: secondaryIds,
    },
  });
}
