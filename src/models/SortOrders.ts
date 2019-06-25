export default class SortOrders {
  id: number = 1;
  tag: number = 1;
  todo: number = 1;
  progress: number = 1;
  complete: number = 1;

  selectKey(key: string) {
    switch (key) {
      case 'id':
        this.id *= -1;
        break;
      case 'tag':
        this.tag *= -1;
        break;
      case 'todo':
        this.todo *= -1;
        break;
      case 'complete':
        this.complete *= -1;
        break;
      case 'progress':
        this.progress *= -1;
        break;
    }
  }
  getOrder(key: string): number {
    /*
    let order: number = 1;
    if (key === 'id') {
      order = this.id;
    } else if (key === 'name') {
      order = this.name;
    } else {
      order = this.address;
    }
    return order;
    */
    return (this as any)[key];
  }
}
