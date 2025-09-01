import { nanoid } from "nanoid";
import type { MessageId, RoomId } from "./types.ts";

/**
 * **Both, `keys` and `values` must be unique**,
 * Otherwise this data structure wont function correctly!
 */
export class BiDirectionalMap<T, K> {
  private keyMap: Map<T, K>;
  private valueMap: Map<K, T>;

  constructor(items: [T, K][] = []) {
    const newKeyMap: typeof this.keyMap = new Map();
    const newValueMap: typeof this.valueMap = new Map();

    items.forEach(([key, value]) => {
      newKeyMap.set(key, value);
      newValueMap.set(value, key);
    });

    this.keyMap = newKeyMap;
    this.valueMap = newValueMap;
  }

  //==== HAS

  public keyHas(key: T): boolean {
    return this.keyMap.has(key);
  }

  public valueHas(value: K): boolean {
    return this.valueMap.has(value);
  }

  //==== DELETE

  public deleteByKey(key: T): void {
    const value = this.keyMap.get(key);

    if (!value) return;

    this.keyMap.delete(key);
    this.valueMap.delete(value);
  }

  public deleteByValue(value: K): void {
    const key = this.valueMap.get(value);

    if (!key) return;

    this.keyMap.delete(key);
    this.valueMap.delete(value);
  }

  //==== GET

  public getByKey(key: T): K | undefined {
    return this.keyMap.get(key);
  }
  public getByValue(value: K): T | undefined {
    return this.valueMap.get(value);
  }

  //==== SET

  public set(key: T, value: K): void {
    // this.keyMap.delete(key);
    // this.valueMap.delete(value);

    this.keyMap.set(key, value);
    this.valueMap.set(value, key);
  }

  //==== KEYS

  public keys() {
    return this.keyMap.keys();
  }

  //==== VALUES

  public values() {
    return this.keyMap.values();
  }
}

export const generateRoomId = (): RoomId => `ROOM_${nanoid()}`;
export const generateMessageId = (): MessageId => `MSG_${nanoid()}`;
