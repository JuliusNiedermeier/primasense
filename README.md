Billing is based on:

- Uploaded video minute = $0.1
- Search hit = $0.05
- Indexed video mb per month = $0.5

Billed at the end of each month

# Roadmap

- Implement usage metering
- Dashboard:
  - Number of indexed videos
  - Total amount of videos
- Search playground

- Return video duration from embeddings service and save to database
- Save video frames in object storage.
- Save original video in object storage.
- Create endpoint that generates a short video clip from a video around a specified time.

- Make video upload asynchronous. Send server events when uploading a video?

- Implement partial-prerendering (ppr) in nextjs, for blazingly fast page load.
