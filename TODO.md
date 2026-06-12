# TODO - Doctors module parity & availability status storage

## Done
- [x] Doctors UI/FE/API/DB CRUD parity implemented (matching Patients behavior).
- [x] Doctors modal includes all required doctor fields (including Phone).
- [x] Doctors availability UI uses Available/Busy/On Leave (status buttons) and converts status ↔ persistence.
- [x] Build verification: `npm run build` passes.

## Remaining
- [ ] Update backend Doctor schema (`server/models/Doctor.js`) to store availability as `{ status }` only (no day/startTime/endTime).
- [ ] Update Doctors UI to remove day/start/end time inputs and show ONLY status buttons with specific colors.
- [ ] Update Doctors UI fetch/transform and submit payload to match new `{ status }` DB shape.
- [ ] Run `npm run build` again.

