import { createReader } from "@keystatic/core/reader";

import { keystaticConfig } from "@/config/keystatic-config";

/**
 * Typed, filesystem-backed access to the Keystatic collections. Content is
 * always read from the checked-out repository, whichever storage mode the
 * dashboard uses, so it must only be called on the server.
 */
export const contentReader = createReader(process.cwd(), keystaticConfig);
