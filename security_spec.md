# Security Specification for ScholarSync

## Data Invariants
- An Order must belong to a Client.
- A Message must belong to an Order.
- Only the Client of an order or an Admin/Writer can read/write messages in that order.
- Users cannot change their own `role` once set (or only Admins can).
- Orders cannot be deleted by Clients once "In Progress".

## The "Dirty Dozen" Payloads (Selection)
1. **Identity Spoofing**: Attempt to create an order as another user (`clientId` mismatch).
2. **Privilege Escalation**: Attempt to update `role` to 'admin' in user profile.
3. **Ghost Fields**: Attempt to add `isVIP: true` to an order.
4. **Outcome Manipulation**: Client attempts to set order status to 'completed'.
5. **Orphaned Message**: Attempt to post message to a non-existent `orderId`.
6. **Query Scraping**: Attempt to list all orders without `where(clientId == uid)`.
7. **PII Leak**: Non-owner attempts to 'get' a user profile.

## Test Runner (Logic Check)
The tests will verify:
- `PERMISSION_DENIED` for mismatched `clientId`.
- `PERMISSION_DENIED` for invalid status transitions by Clients.
- `PERMISSION_DENIED` for unauthorized message reads.
