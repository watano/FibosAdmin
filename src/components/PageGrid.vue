<template>
  <div class="pageGrid">
    <slot name="opForm"></slot>
    <slot name="queryForm"></slot>
    <slot name="listDialog"></slot>
    <slot name="resultGrid"></slot>
    <slot name="resultActions"></slot>
    <el-pagination layout="prev, pager, next, total" :total="page.total" :page-size="page.size" :current-page="page.pageNo" style="float:right" @size-change="pageSizeChange" @current-change="pageChange">
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      page: {
        total: 0,
        pageNo: 1,
        size: 10,
      },
      errToast: false,
      errMsg: '',
    };
  },
  methods: {
    updatePage(p) {
      var _this = this;
      //console.log(JSON.stringify(p));
      _this.page.total = p.total;
    },
    pageChange(newPageNo) {
      //console.log('pageChange:' + newPageNo);
      var _this = this;
      _this.page.from = (parseInt(newPageNo, 10) - 1) * _this.page.size + 1;
      //console.log(_this.page);
      _this.doQuery();
    },
    pageSizeChange(newPageSize) {
      //console.log('pageSizeChange:' + newPageSize);
      var _this = this;
      _this.page.size = parseInt(newPageSize, 10);
      //_this.doQuery();
    },
    doQuery() {
      this.$emit('doQuery');
    },
  },
};
</script>
<style lang="css">
.pageGrid {
  min-width: 900px;
  overflow: auto;
  margin: 10px;
}

.el-pagination {
  margin-top: 5px;
}
</style>
