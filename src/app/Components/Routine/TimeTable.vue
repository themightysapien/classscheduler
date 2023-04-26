<template>
  <div :class="containerClass" class="timetable ">
    <slot></slot>
    <div class="p-datatable-loading-overlay p-component-overlay" v-if="loading">
      <i :class="loadingIconClass"></i>
    </div>
    <div class="p-datatable-header" v-if="$slots.header" style="margin-left: -19px">
      <slot name="header"></slot>
    </div>
    <div class="table">

      <div class="timetable-header">
        <Header :columns="columns" :value="value" />
      </div>


      <Body @onDrop="$emit('onDrop', $event)" :columns="columns" :value="value">
        <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </Body>
        <slot name="afterbody"></slot>

    </div>
    <div class="p-datatable-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import Header from "./Header.vue";
import Body from "./Body.vue";
export default {
  components: {
    Header, Body
  },
  props: {
    section: {required: true},
    title: { type: String, default: "" },
    loading: { default: false },
    value: {
      type: Array,
      default: null,
    },
    dataKey: {
      type: String,
      default: null,
    },
    stripedRows: { default: false },

  },
  emits: ['onDrop'],
  provide(){
    return {
        sectionId: this.section['uuid']
    }
  },
  methods: {
    getChildren() {
      return this.$slots.default ? this.$slots.default() : null;
    },
    recursiveGetChildren(children, results) {
      if (!results) {
        results = [];
      }
      if (children && children.length) {
        children.forEach((child) => {
          if (child.children instanceof Array) {
            results.concat(
              this.recursiveGetChildren(child.children, results)
            );
          } else if (child.type.name == "Column") {
            results.push(child);
          }
        });
      }
      return results;
    },
  },
  mounted() {
    // console.log(this.$slots);
    // console.log(this.columns, this.headerColumnGroup);
  },
  computed: {
    containerClass() {
      return [
        "tt-component",
        {

          "p-datatable-striped": this.stripedRows,

        },
      ];
    },
    columns() {
      let children = this.getChildren();

      if (!children) {
        return;
      }

      const cols = this.recursiveGetChildren(children, []);

      //   if (this.reorderableColumns && this.d_columnOrder) {
      //     let orderedColumns = [];
      //     for (let columnKey of this.d_columnOrder) {
      //       let column = this.findColumnByKey(cols, columnKey);
      //       if (column) {
      //         orderedColumns.push(column);
      //       }
      //     }

      //     return [
      //       ...orderedColumns,
      //       ...cols.filter((item) => orderedColumns.indexOf(item) < 0),
      //     ];
      //   }

      return cols;
    },
    headerColumnGroup() {
      const children = this.getChildren();
      if (children) {
        for (let child of children) {
          if (
            child.type.name === "ColumnGroup" &&
            this.columnProp(child, "type") === "header"
          ) {
            return child;
          }
        }
      }

      return null;
    },
    footerColumnGroup() {
      const children = this.getChildren();
      if (children) {
        for (let child of children) {
          if (
            child.type.name === "ColumnGroup" &&
            this.columnProp(child, "type") === "footer"
          ) {
            return child;
          }
        }
      }

      return null;
    },
  }
};
</script>
