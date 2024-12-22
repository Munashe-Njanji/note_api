import Elysia, { t } from "elysia";
import { userService, getUserId } from "./user";

// Define the memo schema
const memo = t.Object({
  data: t.String(),
  author: t.String(),
});

type Memo = typeof memo.static;

/**
 * An advanced implementation of a Note class to handle Memo objects with robust TypeScript support.
 */
class Note {
  private readonly data: Memo[];

  /**
   * Constructs a new Note instance with optional initial data.
   * @param initialData - An array of Memo objects.
   */
  constructor(
    initialData: ReadonlyArray<Memo> = [
      { data: "Moonhalo", author: "saltyaom" },
    ] as ReadonlyArray<Memo>
  ) {
    this.data = [...initialData];
  }

  /**
   * Adds a new memo to the collection.
   * @param memo - The memo to add. Must conform to the Memo type.
   * @returns A readonly array representing the updated collection.
   * @throws Error if the memo is invalid.
   */
  public add(memo: Memo): ReadonlyArray<Memo> {
    if (!memo.data || !memo.author) {
      throw new Error("Invalid memo: 'data' and 'author' fields are required.");
    }
    this.data.push(memo);
    return [...this.data];
  }

  /**
   * Removes a memo by its index.
   * @param index - The zero-based index of the memo to remove.
   * @returns A readonly array of the updated collection.
   * @throws Error if the index is invalid.
   */
  public remove(index: number): ReadonlyArray<Memo> {
    if (!this.isValidIndex(index)) {
      throw new Error("Invalid index: Unable to remove memo.");
    }
    const updated = [...this.data];
    updated.splice(index, 1);
    return updated;
  }

  /**
   * Updates a memo at the specified index.
   * @param index - The zero-based index of the memo to update.
   * @param memo - The new memo value. Must conform to the Partial<Memo> type.
   * @returns The updated memo.
   * @throws Error if the index or memo is invalid.
   */
  public update(index: number, memo: Partial<Memo>): Memo {
    if (!this.isValidIndex(index)) {
      throw new Error("Invalid index: Unable to update memo.");
    }
    if (memo.data === undefined && memo.author === undefined) {
      throw new Error(
        "Invalid memo: At least one field ('data' or 'author') is required to update."
      );
    }
    this.data[index] = { ...this.data[index], ...memo };
    return this.data[index];
  }

  /**
   * Retrieves a memo by its index.
   * @param index - The zero-based index of the memo to retrieve.
   * @returns The memo at the specified index.
   * @throws Error if the index is invalid.
   */
  public get(index: number): Memo {
    if (!this.isValidIndex(index)) {
      throw new Error("Invalid index: Unable to retrieve memo.");
    }
    return this.data[index];
  }

  /**
   * Retrieves all memos in the collection as a readonly array.
   * @returns A readonly array of all memos.
   */
  public getAll(): ReadonlyArray<Memo> {
    return [...this.data];
  }

  /**
   * Clears all memos from the collection.
   * @returns An empty readonly array.
   */
  public clear(): ReadonlyArray<Memo> {
    this.data.length = 0;
    return [];
  }

  /**
   * Checks if an index is valid for the current collection.
   * @param index - The index to validate.
   * @returns `true` if the index is valid, otherwise `false`.
   */
  private isValidIndex(index: number): boolean {
    return index >= 0 && index < this.data.length;
  }

  /**
   * Counts the total number of memos in the collection.
   * @returns The number of memos.
   */
  public count(): number {
    return this.data.length;
  }
}

export { Note, Memo };

export const note = new Elysia({ prefix: "/note" })
  .use(userService)
  .decorate("note", new Note())
  .onTransform(function log({ body, params, path, request: { method } }) {
    console.log(`${method} ${path}`, {
      body,
      params,
    });
  })
  .get("/", ({ note }) => note.getAll())
  .use(getUserId)
  .put(
    "/",
    ({ note, body: { data }, username, error }) => {
      try {
        return note.add({ data, author: username });
      } catch (e: any) {
        return error(400, e.message);
      }
    },
    {
      body: t.Object({
        data: t.String(),
      }),
    }
  )
  .guard({
    params: t.Object({
      index: t.Number(),
    }),
  })
  .get("/:index", ({ note, params: { index }, error }) => {
    try {
      return note.get(index);
    } catch (e: any) {
      return error(404, e.message);
    }
  })
  .delete("/:index", ({ note, params: { index }, error }) => {
    try {
      return note.remove(index);
    } catch (e: any) {
      return error(422, e.message);
    }
  })
  .patch(
    "/:index",
    ({ note, params: { index }, body: { data }, error, username }) => {
      try {
        return note.update(index, { data, author: username });
      } catch (e: any) {
        return error(422, e.message);
      }
    },
    {
      body: t.Object({
        data: t.String(),
      }),
    }
  );
