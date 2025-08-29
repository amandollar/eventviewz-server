## Backend Flow Diagrams

### Authentication
```mermaid
flowchart TD
  A[Client] -->|Register/Login| B[Auth Controller]
  B -->|Register| C[Validate & Hash Password]
  C --> D[Create User]
  D --> E[Issue Tokens]
  B -->|Login| F[Find User + Verify Password]
  F --> E
  E --> G[Set refreshToken cookie + return accessToken]

  A -->|Google OAuth start| H[GET /auth/google]
  H --> I[Google Consent]
  I --> J[OAuth Callback]
  J --> K[Find/Create User]
  K --> E
```

### Event Registration (Free vs Paid)
```mermaid
flowchart TD
  A[Client] -->|POST /registrations/register| B[Registration Controller]
  B --> C[Load Event]
  C --> D{Event Active?
  & Seats Available?}
  D -- No --> X[400 Error]
  D -- Yes --> E[Find Ticket by ticketType]
  E --> F{ticket.price > 0?}
  F -- Yes --> Y[400 Use Payment Flow]
  F -- No --> G[Create Registration status=confirmed]
  G --> H[confirmRegistrationEffects]
  H --> H1[Decrement ticket availability]
  H --> H2[Add participant]
  H --> H3[Increment currentParticipants]
  H --> H4[Generate hall ticket]
  H --> I[200 Return registration + hallTicket]
```

### Payment (Paid Tickets)
```mermaid
flowchart TD
  subgraph Create Order
    A[Client] -->|POST /payments/create-order| B[Payment Controller]
    B --> C[Load Event + Ticket]
    C --> D{Ticket available?}
    D -- No --> E1[400 Tickets not available]
    D -- Yes --> E[Create Razorpay Order]
    E --> F[Create Registration status=pending]
    F --> G[201 Return order + registrationId]
  end

  subgraph Verify Payment
    A2[Client] -->|POST /payments/verify| H[Verify Signature]
    H --> I{Valid?}
    I -- No --> J[400 Invalid signature]
    I -- Yes --> K[Load Registration + Event]
    K --> L[Set status=confirmed, payment fields]
    L --> M[confirmRegistrationEffects]
    M --> M1[Decrement ticket availability]
    M --> M2[Add participant]
    M --> M3[Increment currentParticipants]
    M --> M4[Generate hall ticket]
    M --> N[200 Return registration + event]
  end
```

### Cancellation
```mermaid
flowchart TD
  A[Client] -->|DELETE /registrations/cancel/:id or POST /payments/cancel/:id| B[Controller]
  B --> C[Load Registration]
  C --> D{status == confirmed?}
  D -- No --> E[Set status=cancelled]
  D -- Yes --> F[Set status=cancelled]
  F --> G[revertConfirmedRegistrationEffects]
  G --> G1[Remove participant]
  G --> G2[Decrement currentParticipants]
  G --> G3[Restore ticket availability]
  E --> H[200 Success]
  G --> H
```

### Status Lifecycle
```mermaid
stateDiagram-v2
  [*] --> pending: Create Order (paid)
  [*] --> confirmed: Free registration
  pending --> confirmed: Payment verified
  pending --> cancelled: Cancel order
  confirmed --> cancelled: User/Admin cancel
  pending --> failed: Payment failed
  confirmed --> refunded: Refund processed (future)
```

### Shared Side Effects
```mermaid
flowchart TD
  subgraph confirmRegistrationEffects
    A[Registration] --> B[Event]
    B --> C[Find ticketIndex]
    C --> D[available = max(0, available - 1)]
    A --> E[Generate hall ticket if missing]
    B --> F[Add participant if absent]
    B --> G[currentParticipants += 1]
  end

  subgraph revertConfirmedRegistrationEffects
    A2[Registration] --> B2[Event]
    B2 --> C2[Find ticketIndex]
    C2 --> D2[available += 1]
    B2 --> E2[Remove participant]
    B2 --> F2[currentParticipants = max(0, current - 1)]
  end
```

Notes:
- Free tickets are confirmed immediately; paid tickets require order + verification.
- All participant/count/ticket updates and hall ticket generation are centralized.

