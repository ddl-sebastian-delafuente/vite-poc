import { BehaviorSubject, Subscription } from 'rxjs';

export type StoreSubscription = Subscription;

/**
 * Stores data of a specified type. These objects allow for set, update, get and subscribe to data
 */
class StoreItem<T> {
  private data: BehaviorSubject<T>;

  constructor(value: T) {
    this.setData(value);
  }

  setData(value: T) {
    const observable = new BehaviorSubject<T>(value);
    this.data = observable;
  }

  getData() {
    return {
      value: this.data.value
    };
  }

  updateData(value: T) {
    this.data.next(value);
  }

  subscribe(callback: (val: T) => void) {
    return this.data.subscribe(callback);
  }
}

/**
 * The function below declares a global object when called.
 * And returns setter, getter, update, subscribe, remove functions to modify the global object.
 *
 * This resembles the window.sessionStorage with pub/sub logic, the global object is just like the session storage
 * and each key/value pair corresponds to a StoreItem object of specified type.
 */
const initStore = () => {
  // Global store object
  const store = {};

  /**
   * Setter function to set data to the Global store object
   *
   * key - a unique key to refer the data to store in the global store
   * defaultValue - value to set to the key
   * onUpdate - a callback function that triggers when the data of this key gets an update
   */
  function setItem<T>(key: string, defaultValue: T, onUpdate?: (val: T) => void) {
    try {
      if (key in store) {
        (store[key] as StoreItem<T>).updateData(defaultValue);
        if (onUpdate) {
          return (store[key] as StoreItem<T>).subscribe(onUpdate);
        }
      } else {
        const storeItem = new StoreItem<T>(defaultValue);
        store[key] = storeItem;
        if (onUpdate) {
          return storeItem.subscribe(onUpdate);
        }
      }
      return ;
    } catch(err) {
      console.error(err);
      throw new Error('Something went wront while accessing the global storage.');
    }
  }

  /**
   * Function to clear data in the Global store object
   *
   * key - a unique key to refer the data stored in the global store
   */
  function removeItem(key: string) {
    if (key in store) {
      return delete store[key];
    }
    return new Error('Required key not present in the global storage.');
  }

  /**
   * Function to get data in the Global store object
   *
   * key - a unique key to refer the data stored in the global store
   */
  function getItem<T>(key: string) {
    try {
      if (key in store) {
        return (store[key] as StoreItem<T>).getData().value;
      }
      return undefined;
    } catch(err) {
      console.error(err);
      return err;
    }
  }

  /**
   * Function to subscribe for the Global store object updates of a specific key
   *
   * key - a unique key to refer the data stored in the global store
   * onUpdate - a callback that triggers when the provided key in global store object gets updated
   */
  function subscribe<T>(key: string, onUpdate: (val: T) => void) {
    try {
      if (key in store) {
        const storeItem = store[key] as StoreItem<T>;
        return storeItem.subscribe(onUpdate);
      }
      throw new Error('Required key not present in the global storage.');
    } catch(err) {
      console.error(err);
      return err;
    }
  }

  /**
   * Function to find whether the Global store object has a specific key
   */
  function hasKey(key: string) {
    return key in store;
  }

  return {
    setItem,
    removeItem,
    getItem,
    hasKey,
    subscribe
  }
}

/**
 * This exports the getter, setter, update, subscribe, remove functions to access the global store
 */
export default initStore();
