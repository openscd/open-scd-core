/**
 * Central `Event Bus` for OpenSCD
 *
 * This `Event Bus` will be passed down to each plugin.
 */
export class EventBus implements EventTarget {
  /**
   * @ignore
   */
  private _eventListeners: Map<string, EventListenerOrEventListenerObject[]>;

  constructor() {
    this._eventListeners = new Map<
      string,
      EventListenerOrEventListenerObject[]
    >();
  }

  /**
   *
   * @param type Event type
   * @param callback EventListener
   *
   * @see addEventListener
   */
  on(type: string, callback: EventListenerOrEventListenerObject): void {
    this.addEventListener(type, callback);
  }

  /**
   *
   * @param type Event type
   * @param callback EventListener
   *
   * Adds an EventListener to the EventBus
   *
   */
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject
  ): void {
    if (!this._eventListeners.has(type)) {
      this._eventListeners.set(type, []);
    }

    this._eventListeners.get(type)!.push(callback);
  }

  /**
   *
   * @param event Event
   * @returns true if event is dispatched
   *
   * @see dispatchEvent
   */
  emit(event: Event): boolean {
    return this.dispatchEvent(event);
  }

  /**
   *
   * @param event Event
   * @returns true if event is dispatched
   *
   * dispatches an Event on the EventBus
   */
  dispatchEvent(event: Event): boolean {
    if (this._eventListeners.has(event.type)) {
      this._eventListeners
        .get(event.type)!
        .forEach(cb =>
          typeof cb === 'function' ? cb(event) : cb.handleEvent(event)
        );

      return true;
    }

    return false;
  }

  /**
   *
   * @param type Event type
   * @param callback EventListener
   *
   * removes an EventListener
   *
   * @see removeEventListener
   */
  off(type: string, callback: EventListenerOrEventListenerObject): void {
    this.removeEventListener(type, callback);
  }

  /**
   *
   * @param type Event type
   * @param callback EventListener
   *
   * removes an EventListener
   */
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject
  ): void {
    if (this._eventListeners.has(type)) {
      this._eventListeners.set(
        type,
        this._eventListeners.get(type)!.filter(cb => cb !== callback)
      );
    }
  }
}
