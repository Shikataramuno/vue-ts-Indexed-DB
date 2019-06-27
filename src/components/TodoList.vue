<template>
  <div class="todo-view">
    <!-- #### PC用 #### -->
    <div class="pc">
      <b-row class="edit-box">
        <b-col cols="3">
          <label class="title" >「やらなぁ~ あかんこと」を追加 </label>
        </b-col>
        <b-col cols="2">
          <form id="tag">
            <input type="text" class="edit-tag" v-model="tag" placeholder="タグ">
          </form>
        </b-col>
        <b-col cols="2">
          <form id="todo">
            <input type="text" class="edit-todo" v-model="todo" placeholder="やらなぁ~ あかんこと">
          </form>
        </b-col>
        <b-col cols="2">
          <b-button class="add-button" variant="success" @click="addTodo">追加</b-button>
        </b-col>
        <b-col cols="3">
        </b-col>
      </b-row>
      <b-row class='query-box'>
        <b-col cols="3">
          <label class="title" >「やらなぁ~ あかんこと」を検索</label>
        </b-col>
        <b-col cols="2">
          <form id="search">
            <input type="text" class="filter" v-model="searchQuery" placeholder="フィルタ">
          </form>
        </b-col>
        <b-col cols="7">
        </b-col>
      </b-row>
      <div class="table-row header">
        <div class="wrapper attributes header">
          <div v-for="(val, idx) in columns" v-bind:key=idx @click="sortBy(val)" :class="[{ active: sortKey === val }, val, 'header']">
            <span v-if="val==='id'">ID</span>
            <span v-else-if="val==='tag'">タグ</span>
            <span v-else-if="val==='todo'">やらなぁ~あかんこと</span>
            <span v-else-if="val==='complete'">完了（✓）</span>
            <span v-else>削除</span>
            <span class="arrow" :class="sortOrders[val] > 0 ? 'asc' : 'dsc'"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- #### スマホ用 #### -->
    <div class="mobile">
      <b-row class="edit-box">
        <label class="title" >「やらなぁ~ あかんこと」を追加 </label>
        <input type="text" class="edit-tag" v-model="tag" placeholder="タグ">
        <input type="text" class="edit-todo" v-model="todo" placeholder="やらなぁ~ あかんこと">
        <div class="edit-button">
          <b-button class="add-button" variant="success" @click="addTodo">追加</b-button>
        </div>
      </b-row>
      <div class="sepalator"></div>
      <b-row class='query-box'>
        <label class="title" >「やらなぁ~ あかんこと」を検索</label>
        <input name="query" class="filter" v-model="searchQuery" placeholder="フィルタ文字列">
      </b-row>
      <div class="sepalator"></div>
      <b-container class="table-row header">
        <label class="title" >「やらなぁ~ あかんこと」の一覧</label>
        <b-dropdown id="ddown-buttons"
          split right variant="success"
          size="sm"
          class="sorter">
          <template slot="button-content">
            <span v-if="sortKey==='id'">ID</span>
            <span v-else-if="sortKey==='tag'">タグ</span>
            <span v-else-if="sortKey==='todo'">やらなぁ~あかんこと</span>
            <span v-else>完了（✓）</span>
            <span class="arrow" :class="sortOrders[sortKey] > 0 ? 'asc' : 'dsc'"></span>
          </template>
          <b-dropdown-item
            v-for="(val, idx) in columns"
            v-bind:key=idx
            @click="sortBy(val)"
            :class="[{ active: sortKey === val }, { focus: sortKey == val }]">
            <span v-if="val==='id'">ID</span>
            <span v-else-if="val==='tag'">タグ</span>
            <span v-else-if="val==='todo'">やらなぁ~あかんこと</span>
            <span v-else-if="val==='complete'">完了（✓）</span>
          </b-dropdown-item>
        </b-dropdown>
      </b-container>
    </div>

    <!-- #### PC・スマホ　共通 #### -->
    <div class="data-field">
      <div v-for="(todo,idx) in Todos" v-bind:key=idx>
        <div class="table-row data"
          v-bind:style="[selectedId===todo.id ? styleForSelectedRow : idx%2 === 0 ? styleForNonSelectedEvenRow : styleForNonSelectedOddRow]"
          @click="edit(todo.id)">
          <div class="wrapper attributes data">
            <div v-for="(val, idx) in columns" v-bind:key=idx :class="[val]">
              <span class='mobile-title' v-if="val==='id'">【ID】</span>
              <span class='mobile-title' v-else-if="val==='tag'">【タグ】</span>
              <span class='mobile-title' v-else-if="val==='todo'">【やらなぁ~あかんこと】<br></span>
              <span class='mobile-title' v-else-if="val==='complete'">【完了（✓）】</span>
              <span class='mobile-title' v-else>【削除】</span>

              <span v-if="val==='complete'"
                class="complete-checkbox-span">
                <label>
                <input  
                　type="checkbox"
                  v-model="todo.complete"
                  @change="completed(todo)"/>
                終わったらチェック！
                </label>
              </span>
              <span v-else-if="val==='delete'"
                class="delete-button-span">
                <b-button
                  class="delete-button"
                  variant="success"
                  @click="deleteTodo(todo)">
                    削除
                </b-button>
              </span>
              <span v-else
                class="content"
                :class="[val]">
                  {{todo[val]}}
              </span>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import Todo from '../models/Todo';
import Todos from '../models/Todos';
import SortOrders from '../models/SortOrders';

@Component
export default class TodoList extends Vue {
  name: string = 'TodoList';
  columns: string[] = ['id', 'tag', 'todo', 'complete', 'delete'];
  styleForSelectedRow: object = {'background-color': '#C0C0C0'};
  styleForNonSelectedEvenRow: object = {'background-color': '#FFFFFF'};
  styleForNonSelectedOddRow: object = {'background-color': '#F5F5F5'};

  sortOrders: SortOrders = new SortOrders();
  todos: Todos = Todos.getInstance();

  searchQuery: string = '';
  sortKey: string = 'キー';
  selectedId: number = -1;
  tag: string = '';
  todo: string = '';

  // computed
  get Todos(): Todo[] {
    let ret: Todo[] = this.todos.getTodos();
    const filterKey: string = this.searchQuery && this.searchQuery.toLowerCase();
    if (filterKey) {
      ret = ret.filter((row: Todo) => {
        return row.isIncluded(filterKey);
      });
    }
    const order = this.sortOrders.getOrder(this.sortKey) || -1;
    ret = ret.slice().sort((a: Todo, b: Todo) => {
      const aVal: string = a.getValue(this.sortKey);
      const bVal: string = b.getValue(this.sortKey);
      return (aVal === bVal ? 0 : aVal > bVal ? 1 : -1) * order;
    });
    return ret;
  }

  sortBy(key: string): void {
    this.sortKey = key;
    this.sortOrders.selectKey(this.sortKey);
  }
  edit(id: number): void {
    this.selectedId = id;
  }
  async addTodo(): Promise<any> {
    await this.todos.addTodo( new Todo(0, this.tag, this.todo, false));
    this.tag = this.todo = '';
  }
  async deleteTodo(target: Todo): Promise<any> {
    await this.todos.deleteTodo(target);
  }
  completed(todo: Todo): void {
    this.$nextTick(() => {
      this.todos.updateTodo(todo);
    });
  }
  async created(): Promise<void> {
    await this.todos.init();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.todo-view{
  width: 80%;
  height: 100%;
  padding: 5px;
  margin: 0 auto;
}
.pc {
  font-size: 80%;
  font-weight: bold;
  display: block;
}
.mobile {
  font-size: 80%;
  font-weight: bold;
  display: none;
}
.query-box, .edit-box {
  height: auto;
  margin: 4px 0px;
}
.table-row {
  border-bottom: 1px solid #e0e0e0;
  border-collapse: collapse;
  margin-left: 0px;
  margin-right: auto;
}
.table-row.header {
  height: auto;
  background-color: rgb(229, 255, 219);
  font-weight: bold;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 4px;
}
.row {
  margin-left: 0px;
}
.add-button {
  float: left;
  line-height: 1em;
  margin-bottom: 4px;
}
.col-2, .col-3 {
  padding: 4px;
}
.title {
  float: right;
  text-align: right;
  color:  rgb(26, 92, 0);
}
.filter, .edit-tag, .edit-todo {
  width: 100%;
  margin-bottom: auto;
  font-size: medium;
}
.wrapper {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
}
.attributes {
  flex-grow: 0;
  -webkit-flex-grow: 0;
}
.wrapper.attributes.header {
  line-height: 1.5em;
}
/* data-field */
.data-field {
  height: 600px;
  overflow-y: scroll;
  min-height: 100px;
  max-height: 1000px;
  border:rgba(63, 63, 63, 0.1) solid 1px;
  box-shadow: 2px 2px 10px rgba(63, 63, 63, 0.2);
}
.table-row.data {
  height: auto;
  width: 100%;
  padding-left: 6px;
  padding-right: 6px;
}
.wrapper.attributes.data {
  height: auto;
  margin-left: 0px;
  margin-right: 0px;
  padding-top: 6px;
}
/* column items */
.mobile-title {
  display: none;
}
.id {
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
  vertical-align: middle;
}
.tag {
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
  vertical-align: middle;
}
.todo {
  width: 50%;
  text-align: left;
  word-break : break-all;
}
.complete {
  width: 200px;
  text-align: center;
}
.delete {
  width: 200px;
  margin: 0 auto;
}
.delete-button {
  line-height: 1em;
  margin: 0 auto;
  margin-bottom: 4px;
}
/*
 * Media queries: optimize for different screen widths.
 */
@media only screen 
    and (device-width : 375px) 
    and (device-height : 812px) 
    and (-webkit-device-pixel-ratio : 3) {

  .todo-view{
    width: 100%;
    height: 100%;
    padding: 5px;
    overflow: hidden;
  }
  .pc {
    font-size: 80%;
    font-weight: bold;
    display: none;
  }
  .mobile {
    height: 296px;
    font-size: 80%;
    font-weight: bold;
    display: block;
  }
  .edit-box {
    height: 152px;
    margin: 4px 0px;
  }
  .query-box {
    height: 52px;
    margin: 4px 0px;
  }
  .sepalator {
    height: 1px;
    border:rgba(63, 63, 63, 0.1) solid 1px;
  }
  .table-row.header {
    height: 70px;
  }
  .edit-tag, .edit-todo {
    margin: 4px;
  }
  .edit-button {
    width: 100%;
    margin: 4px;
  }
  .add-button {
    float: right;
    line-height: 1em;
    margin: 4px;
  }
  .title {
    float: left;
    text-align: left;
  }
  .filter {
    width: 100%;
  }
  .sorter {
    width: 100%;
  }
  .dropdown .dropdown-menu .dropdown-item:focus {
    width: 60%;
    outline: none;
  }
  /* */
  .data-field {
    height: 500px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .wrapper.attributes.data {
    padding: 18px 0px;
    height: auto;
  }
  .mobile-title {
    display: inline;
  }
  .attributes {
    flex-direction: column;
    -webkit-flex-direction: column;
  }
  .attributes div {
    flex-grow: 0;
    -webkit-flex-grow: 0;
  }
  .attributes > div {
    width: 100%;
  }
  .id {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .tag {
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .todo {
    width: 50%;
    text-align: left;
    word-break : break-all;
  }
  .content.todo, .content.tag {
    word-wrap: break-word;
    white-space: normal;
    color:blue;
  }  
  .complete {
    display: flex;
    width: 200px;
    height: 40px;
    padding-top: 12px;
    text-align: left;
  }
  .complete-checkbox-span {
    margin-left: 4px;
  }
  .delete {
    width: 200px;
    height: 40px;
    padding-top: 12px;
    text-align: left;
  }
  .delete-button {
    line-height: 1em;
    margin-left: 4px;
  }
  .delete-button-span {
    margin-left: 4px;
  }
}
/*
 * General good-look styles
 */
div.active {
  color: rgb(55, 11, 177);
}
.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.0;
}
.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #000;
}
.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #000;
}
.sorter .arrow {
  opacity: 1;
}
div.active .arrow {
  opacity: 1;
}
div.active .arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid rgb(55, 11, 177);
}
div.active .arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid rgb(55, 11, 177);
}
</style>
