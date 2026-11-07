import assert from "node:assert/strict";
import { DEFAULT_CLIENTS } from "../src/components/dashboard/clients/clients-data";
import { acceptedFileTypes, detectFileKind, fileStatistics, getClientFiles, MAX_CLIENT_FILE_BYTES, removeClientFile, saveClientFile, validateLocalFile, type ClientFileRecord } from "../src/components/dashboard/clients/client-files-data";

const request: ClientFileRecord = { id: "file-request", clientId: "cl-1", name: "Brand logo", kind: "image", status: "requested", requestedAt: "2026-11-07T10:00:00Z", description: "Transparent background" };
assert.deepEqual(getClientFiles(DEFAULT_CLIENTS[0]), []);
const requested = saveClientFile(DEFAULT_CLIENTS, "cl-1", request);
assert.deepEqual(fileStatistics(getClientFiles(requested[0])), { requested: 1, uploaded: 0, all: 1 });
assert.equal(requested[1], DEFAULT_CLIENTS[1]);
assert.deepEqual(getClientFiles(requested[1]), []);
assert.equal(saveClientFile(DEFAULT_CLIENTS, "cl-2", request), DEFAULT_CLIENTS);
const blob = new File(["image-content"], "logo.png", { type: "image/png" });
const fulfilled = saveClientFile(requested, "cl-1", { ...request, status: "uploaded", file: blob, name: blob.name, requestedName: request.name, uploadedAt: "2026-11-07T11:00:00Z" });
assert.deepEqual(fileStatistics(getClientFiles(fulfilled[0])), { requested: 0, uploaded: 1, all: 1 });
assert.equal(getClientFiles(fulfilled[0])[0].requestedAt, request.requestedAt);
assert.equal(getClientFiles(fulfilled[0])[0].file, blob);
assert.equal(await getClientFiles(fulfilled[0])[0].file?.text(), "image-content");
assert.equal(getClientFiles(requested[0])[0].status, "requested", "Updates must not mutate existing state");
const added = saveClientFile(fulfilled, "cl-1", { ...request, id: "direct-upload", status: "uploaded", requestedAt: undefined, file: new File(["text"], "brief.pdf", { type: "application/pdf" }) });
assert.deepEqual(fileStatistics(getClientFiles(added[0])), { requested: 0, uploaded: 2, all: 2 });
assert.equal(getClientFiles(removeClientFile(added, "cl-2", request.id)[0]).length, 2);
assert.equal(getClientFiles(removeClientFile(added, "cl-1", request.id)[0]).length, 1);
assert.deepEqual(getClientFiles(removeClientFile(requested, "cl-1", request.id)[0]), []);
assert.deepEqual(getClientFiles({ ...DEFAULT_CLIENTS[1], files: [request] }), []);

const types = [
  ["photo.PNG", "image"], ["brief.docx", "document"], ["requirements.pdf", "document"],
  ["budget.csv", "spreadsheet"], ["workbook.xlsx", "spreadsheet"], ["slides.pptx", "presentation"],
  ["assets.zip", "archive"], ["recording.mp3", "audio"], ["demo.mp4", "video"], ["unknown.bin", "other"],
] as const;
for (const [name, expected] of types) assert.equal(detectFileKind(name), expected);
assert.equal(detectFileKind("no-extension", "image/png"), "image");
assert.equal(detectFileKind("no-extension", "application/pdf"), "document");
assert.equal(detectFileKind("data.csv", "text/csv"), "spreadsheet");
assert.equal(validateLocalFile(blob, "image"), null);
assert.ok(validateLocalFile(blob, "document"));
assert.equal(validateLocalFile(blob, "other"), null);
assert.ok(validateLocalFile({ name: "big.pdf", type: "application/pdf", size: MAX_CLIENT_FILE_BYTES + 1 }));
assert.equal(validateLocalFile({ name: "max.pdf", type: "application/pdf", size: MAX_CLIENT_FILE_BYTES }), null);
assert.equal(acceptedFileTypes("other"), undefined);
assert.ok(acceptedFileTypes("image")?.includes(".png"));
console.log("PASS: client isolation, file request/fulfillment/removal, counts, retained file contents, type detection, and size/type validation.");
