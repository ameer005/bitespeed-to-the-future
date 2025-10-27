# ⚡ Flux Identify — Bitespeed Backend Challenge

> “Great Scott! We’ve got duplicate contacts across timelines!”  
> — Dr. Emmett Brown, 2023

Meet **Doc Brown**, the time-traveling genius hopelessly stuck in 2023.  
To rebuild his flux capacitor, he’s been secretly ordering parts from **FluxKart.com**, using a _different email and phone number each time_ (because, you know... the timeline police 👀).

Unfortunately for Bitespeed, this made customer identity reconciliation harder than navigating the space-time continuum.  
So here we are — **linking Doc’s multiple identities into one timeline** ⚙️

---

## The Challenge

Build a service that can **identify and reconcile user identities** based on their email and phone number.  
If multiple contacts share an email or phone, they belong to the same customer — the earliest contact is “primary”, and others are “secondary”.

---

## Tech Stack

| Tool                  | Purpose                                   |
| --------------------- | ----------------------------------------- |
| **Node.js + Express** | Backend framework                         |
| **Prisma ORM**        | Database modeling                         |
| **PostgreSQL**        | Primary database                          |
| **Railway**           | Hosting                                   |
| **Humor**             | For when debugging breaks the timeline 🕒 |

---

## Endpoints

### `POST /identify`

#### Example Request

```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```
