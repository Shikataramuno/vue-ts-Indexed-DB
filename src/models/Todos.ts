import Todo from './Todo';

const ToDosKeyWord: string = 'Todos';
const IdKeyWord: string = 'id';
export default class Todos {

  static getInstance(): Todos {
    console.log('MemberList.getInstance');
    if (!this.instance) {
      console.log('call constructor');
      this.instance = new Todos();
    }
    return this.instance;
  }

  private static instance: Todos;
  private todos: Todo[] = [];
  private id: number = 1;

  constructor() {
    console.log('Todos class constructor');
    if (IdKeyWord in localStorage) {
      this.id = JSON.parse(localStorage.getItem(IdKeyWord) as string) as number;
    } else {
      localStorage.setItem(IdKeyWord, JSON.stringify(this.id));
    }
    if (ToDosKeyWord in localStorage) {
      const objs: Todo[] = JSON.parse(localStorage.getItem(ToDosKeyWord) as string) as Todo[];
      objs.forEach((obj: Todo) => {
        const todo: Todo = new Todo(obj.id, obj.tag, obj.todo, obj.complete);
        this.todos.push(todo);
      });
    } else {
      localStorage.setItem(ToDosKeyWord, JSON.stringify(this.todos));
    }
  }

  getTodos(): Todo[] {
    return this.todos.slice();
  }

  update(todo: Todo): void {
    const index: number = this.todos.findIndex((td: Todo) => {
      return td.id === todo.id;
    });
    this.todos[index] = todo;
    localStorage.setItem(ToDosKeyWord, JSON.stringify(this.todos));
  }

  addTodo(todo: Todo): void {
    todo.id = this.id;
    this.todos.push(todo);
    localStorage.setItem(ToDosKeyWord, JSON.stringify(this.todos));
    this.id++;
    localStorage.setItem(IdKeyWord, JSON.stringify(this.id));
  }

  delete(target: Todo): void {
    this.todos = this.todos.filter((todo: Todo) => {
      return todo.id !== target.id;
    });
    localStorage.setItem(ToDosKeyWord, JSON.stringify(this.todos));
  }
}
