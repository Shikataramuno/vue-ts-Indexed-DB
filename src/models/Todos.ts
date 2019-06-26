import Todo from './Todo';

export default class Todos {

  static getInstance(): Todos {
    if (!this.instance) {
      this.instance = new Todos();
    }
    return this.instance;
  }

  private static instance: Todos;
  private todos: Todo[] = [];
  private dbName: string = 'TodosDb';
  private todosObjectStore: string = 'Todos';
  private db!: IDBDatabase;

  // tslint:disable-next-line:no-empty
  constructor() {}

  async init(): Promise<any> {
    await this.connectDb();
    this.todos = (await this.retrieveTodos() as Todo[]);
  }
  async connectDb(): Promise<string> {
    const p: Promise<string> =
     new Promise<string>((resolve: (value?: string) => void, reject: (reason?: any) => void) => {
      const req = window.indexedDB.open(this.dbName, 1);
      req.onsuccess = (ev: Event) => {
        this.db = ((ev.target as IDBOpenDBRequest).result as IDBDatabase);
        resolve('success to open db');
      };
      req.onerror = (ev: Event) => {
        const err = 'fails to open db';
        reject(err);
      };
      req.onupgradeneeded = (ev: Event) => {
        const dbReq: IDBOpenDBRequest = ev.target as IDBOpenDBRequest;
        this.db = dbReq.result as IDBDatabase;
        if (this.db.objectStoreNames.contains(this.todosObjectStore)) {
          this.db.deleteObjectStore(this.todosObjectStore); // Todos ObjectStoreの作成
        }
        this.db.createObjectStore(this.todosObjectStore, {autoIncrement: true});
      };
    });
    return p;
  }
  async retrieveTodos(): Promise<Todo[]> {
    const p: Promise<Todo[]> =
      new Promise<Todo[]>((resolve: (value?: Todo[]) => void, reject: (reason?: any) => void) => {
      const objStore: IDBObjectStore =
        this.db.transaction(this.todosObjectStore, 'readwrite').objectStore(this.todosObjectStore) ;
      const range: IDBKeyRange = IDBKeyRange.lowerBound(0);
      const cur: IDBRequest<IDBCursorWithValue | null> = objStore.openCursor(range);
      const todos: Todo[] = [];
      cur.onsuccess = (e) => {
        const cursor: IDBCursorWithValue = (e.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          const data: Todo = cursor.value as Todo;
          const todo: Todo = new Todo(
            Number(cursor.key),
            data.tag,
            data.todo,
            data.complete,
          );
          // console.log(rec)
          todos.push(todo);
          cursor.continue();
        } else {
          resolve(todos);
        }
      };
      cur.onerror = (err) => {
        reject(err);
      };
    });
    return p;
  }
  getTodos(): Todo[] {
    return this.todos;
  }

  async addTodo(todo: Todo): Promise<any> {
    await this.add(todo);
    this.todos = (await this.retrieveTodos() as Todo[]);
  }
  async add(todo: Todo): Promise<string> {
    const p: Promise<string> =
    new Promise<string>((resolve: (value?: string) => void, reject: (reason?: any) => void) => {
      const id: number = Math.max(...this.todos.map((m) => m.id));
      todo.id = ( Number.MIN_SAFE_INTEGER <= id && id <= Number.MAX_SAFE_INTEGER) ? id + 1 : 0;
      const tx: IDBTransaction = this.db.transaction(this.todosObjectStore, 'readwrite');
      tx.onerror = (e: Event) => {
        reject(e);
      };
      tx.oncomplete = (e: Event) => {
        resolve('transaction add complete');
      };
      tx.objectStore(this.todosObjectStore).add(todo);
    });
    return p;
  }

  async updateTodo(target: Todo): Promise<any> {
    await this.update(target);
    this.todos = (await this.retrieveTodos() as Todo[]);
  }
  update(target: Todo): Promise<string> {
    const p: Promise<string> =
    new Promise<string>((resolve: (value?: string) => void, reject: (reason?: any) => void) => {
      const key: IDBValidKey = target.id;
      const tx: IDBTransaction = this.db.transaction(this.todosObjectStore, 'readwrite');
      tx.onerror = (e: Event) => {
        reject(e);
      };
      tx.oncomplete = (e: Event) => {
        resolve('transaction add complete');
      };
      tx.objectStore(this.todosObjectStore).put(target, key);
    });
    return p;
  }

  async deleteTodo(target: Todo): Promise<any> {
    await this.delete(target);
    this.todos = (await this.retrieveTodos() as Todo[]);
  }
  async delete(target: Todo): Promise<string> {
    const p: Promise<string> =
    new Promise<string>((resolve: (value?: string) => void, reject: (reason?: any) => void) => {
      const key: IDBValidKey = target.id;
      const tx: IDBTransaction = this.db.transaction(this.todosObjectStore, 'readwrite');
      tx.onerror = (e: Event) => {
        reject(e);
      };
      tx.oncomplete = (e: Event) => {
        resolve('transactio delete complete');
      };
      tx.objectStore(this.todosObjectStore).delete(key);
    });
    return p;
  }
}
