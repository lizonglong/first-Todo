;(function () {
var tableList=[];   //任务列表
var $addTask=$(".add-task");    //
init()
//表单绑定submit事件，不是submit按钮
$addTask.on("submit",function (ev) {
    ev.preventDefault();//阻止默认事件
    var obj={}
    obj.content=$addTask.find("input").eq(0).val();
    if(!obj.content)return;
    addTask(obj)
    createHtml()
    $addTask.find("input").eq(0).val(null);//提交后置空
})
//初始化
function init() {
    tableList=store.get("xx") || [];
    createHtml()
}

//存数据
function addTask(obj) {
    tableList.push(obj)
    store.set("xx",tableList)
}

//创建html
function createHtml(){
    var $taskList=$(".task-list");
    // console.log(tableList.length)
    $taskList.html(null)
    for(var i=0;i<tableList.length;i++){
        $taskList.prepend(bindHtml(tableList[i],i))
    }
    bindDelete();//
    bindDetail()
     tick()
}
//绑定html
function bindHtml(data,index) {
    var str='<li data-index="'+index+'">'+
                '<input type="checkbox" class="complate" '+(data.tick? "checked" :"")+'>'+
                '<p class="content">'+data.content+'</p>'+
                '<div class="right">'+
                '<span class="delete r-main">删除</span>'+
                '<span class="detail r-main">详细</span>'+
                '</div>'+
            '</li>'
    return str;
}

/*---------------------------删除------------------------------*/
//点击事件---删除功能---更新本地存储
//点击事件
function bindDelete() {
    $(".delete.r-main").on("click",function () {
        var off=confirm("确定删除？");
        if(!off)return;
        var index=$(this).parent().parent().data("index");
        removeTask(index)
    })
}
//删除功能
function removeTask(index) {
    tableList.splice(index,1)
    refresh()
}
//更新本地存储
function refresh() {
    store.set("xx",tableList)
    createHtml()
}
/*---------------------------删除 end------------------------------*/

/*---------------------------生成详细 start------------------------------*/
//点击事件,获取index---生成---删除
    function bindDetail() {
        $(".detail.r-main").on("click",function () {
          var index=$(this).parent().parent().data("index");
             createDetail(tableList[index],index)
        })
    }

//生成
    function createDetail(data,index) {
        var str='<div class="task-detail-mask"></div>'+
            '<div class="task-detail">'+
            '<form class="up-task">'+
            '<h2 class="content">'+data.content+'</h2>'+
            '<div class="input-item">'+
            '<input type="text" class="dbContent">'+
            '</div>'+
            '<div class="input-item">'+
            '<textarea class="text">'+(data.text || "")+'</textarea>'+
            '</div>'+
            '<div class="remind input-item">'+
            '<label for="b">提醒时间</label>'+
            '<input id="b" class="datetime" type="date" value="'+data.datetime+'">'+
            '</div>'+
            '<div class="input-item">'+
            '<button>更新</button>'+
            '</div>'+
            '<div class="close">X</div>'+
            '</form>'+
            '</div>'
        $(".container").append(str);
        removeDetail();//删除详细
        updateDetail(index);//更新详细
        dbDetail();     //双击
    }
    //删除
    function removeDetail() {
        $(".task-detail-mask,.close").on("click",function () {
            $(".task-detail-mask,.task-detail").remove()
        })
    }
/*---------------------------生成详细 end------------------------------*/

/*---------------------------更新详细 end------------------------------*/
    //点击，获取index
    function updateDetail(index){
        $(".up-task").on("submit",function (ev) {
            ev.preventDefault();
            var newobj={};
            newobj.content=$(this).find(".content").text();
            newobj.text=$(this).find(".text").val();
            newobj.datetime=$(this).find(".datetime").val();
             update(newobj,index);
            $(".task-detail-mask,.task-detail").remove();//
            createHtml()
        })
    }
    //双击
    function dbDetail() {
        $(".up-task .content").on("dblclick",function () {
            var $that=$(this);
            var $dbContent=$(".container .up-task .dbContent");
            $that.hide();
            $dbContent.show();
            $dbContent.focus();
            $dbContent.on("blur",function () {
                console.log(1)
                $that.show();
                $dbContent.hide();
                if(!$dbContent.val())return;
                $that.text($(this).val())
            })

        })
    }
    //更新数据
    function update(newobj,index) {
        // tableList[index]=newobj;//不行
        tableList[index]=$.extend({},tableList[index],newobj)
        store.set("xx",tableList)
        //createDetail(tableList[index],index)
    }
    /*---------------------------更新详细 end------------------------------*/

    /*---------------------------checked-------------------------------*/
    function tick() {
        var $check=$(".complate");
        $check.on("click",function(){
             var index=$(this).parent().data("index");
             if(!tableList[index].tick){
                 update({tick:true},index)
             }
             else{
                 update({tick:false},index)
             }
        })
    }
    /*---------------------------checked-------------------------------*/

}())