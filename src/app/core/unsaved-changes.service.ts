import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UnsavedChangesService {
  private guards = new Set<() => boolean>();

  register(guard: () => boolean): () => void {
    this.guards.add(guard);
    return () => { this.guards.delete(guard); };
  }

  hasUnsavedChanges(): boolean {
    for (const guard of this.guards) {
      if (guard()) return true;
    }
    return false;
  }
}
