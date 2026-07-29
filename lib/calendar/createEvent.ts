// lib/calendar/createEvent.ts
// Single-responsibility function: create ONE event in the user's
// primary Google Calendar and return the event's ID.
//
// Uses the Google Calendar REST API directly via fetch rather than
// importing the full `googleapis` bundle. This keeps the module
// lightweight and avoids any edge-runtime compatibility issues.
//
// The caller is responsible for providing a valid (non-expired) access token.
// Token refresh logic lives in syncWorkSessions.ts, not here.
type CreateCalendarEventParams = {
 accessToken: string;
 summary: string;
 description: string;
 startDateTime: Date;
 durationMins: number;
};
/**
 * Creates a single event in the authenticated user's primary Google Calendar.
 *
 * @param accessToken A valid Google OAuth access token with the
 * calendar.events scope.
 * @param summary The event title shown on the calendar.
 * @param description The multi-line event body (use buildEventDescription).
 * @param startDateTime The UTC start time of the session.
 * @param durationMins Session length in minutes; used to compute endDateTime.
 *
 * @returns The Google Calendar event ID (string).
 * @throws If the Calendar API returns a non-OK status.
 */
export async function createCalendarEvent({
 accessToken,
 summary,
 description,
 startDateTime,
 durationMins,
}: CreateCalendarEventParams): Promise<string> {
 const endDateTime = new Date(
 startDateTime.getTime() + durationMins * 60 * 1000
 );
 const body = {
 summary,
 description,
 start: {
 dateTime: startDateTime.toISOString(),
 timeZone: "UTC",
 },
 end: {
 dateTime: endDateTime.toISOString(),
 timeZone: "UTC",
 },
 };
 const res = await fetch(
 "https://www.googleapis.com/calendar/v3/calendars/primary/events",
 {
 method: "POST",
 headers: {
 Authorization: `Bearer ${accessToken}`,
 "Content-Type": "application/json",
 },
 body: JSON.stringify(body),
 }
 );
 if (!res.ok) {
 const errorText = await res.text();
 throw new Error(
 `Google Calendar API error ${res.status}: ${errorText}`
 );
 }
 const data = (await res.json()) as { id?: string };
 if (!data.id) {
 throw new Error(
 "Google Calendar API returned a response without an event id"
 );
 }
 return data.id;
}