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
    clock()
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
    var complate_items=[];
    for(var i=0;i<tableList.length;i++){
        if(tableList[i].tick){
            complate_items[i]=tableList[i];
        }
        else{
            var $item=bindHtml(tableList[i],i);
            $taskList.prepend($item)
            clock($item)
        }
    }

    for(var j=0;j<complate_items.length;j++){
        if(complate_items[j]){
            var $item=bindHtml(complate_items[j],j)
            $item.addClass("deleteline")
            // if(!$item)continue;
            $taskList.append($item)
        }

    }
    bindDelete();//
    bindDetail()
     tick()     //点击checkbox
}
//绑定html
function bindHtml(data,index) {
    var str='<li data-index="'+index+'" >'+
                '<input type="checkbox" class="complate" '+(data.tick? "checked" :"")+'>'+
                '<p class="content">'+data.content+'</p>'+
                '<div class="right">'+
                '<span class="delete r-main">删除</span>'+
                '<span class="detail r-main">详细</span>'+
                '</div>'+
            '</li>'
    return $(str);     //传出对应的li,只有jQuery对象，给li加class才不会报错
}

/*---------------------------删除 start------------------------------*/
//点击事件---删除功能---更新本地存储
//点击事件
function bindDelete() {
    $(".delete.r-main").on("click",function () {
        var $that=$(this)
        $(".Alert").show()
        // var off=false;
        $(".primary.confirm").bind("click",function () {//记得解绑
            // off=true;
            $(".Alert").hide()
            // if(!off)return;
            var index=$that.parent().parent().data("index");
            removeTask(index)
            $(".primary.confirm").unbind("click");
        })
        $(".cancel").click(function () {
            // off=false;
            $(".Alert").hide()
        })
        // var off=confirm("确定删除？");

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

/*---------------------------生成详细 start------------------------*/
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
            '<input id="b" class="datetime" type="text" value="'+(data.datetime?data.datetime:"")+'">'+
            '</div>'+
            '<div class="input-item">'+
            '<button>更新</button>'+
            '</div>'+
            '<div class="close">X</div>'+
            '</form>'+
            '</div>'

        $(".container").append(str);

        //日期插件
        $.datetimepicker.setLocale('ch');//设置中文
        $('.datetime').datetimepicker();

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

/*---------------------------更新详细 start----------------------------*/
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
    /*---------------------------更新详细 end--------------------------*/

    /*---------------------------checked-------------------------------*/
    function tick() {
        var $check=$(".complate");
        var $alist=$(".container .task-list li");
        $check.on("click",function(){
             var index=$(this).parent().data("index");
             if(!tableList[index].tick){
                 update({tick:true},index)
             }
             else{
                 update({tick:false},index)
             }
             createHtml()       //更新complate
        })
    }

    /*---------------------------checked end---------------------------*/

    /*---------------------------clock start--------------------------*/

    function clock(obj) {
         // console.log($(obj))
        if(!$(obj)[0]) return;
         clearInterval($(obj)[0].timer);
        $(obj)[0].timer=setInterval(function () {
            var startTime=new Date().getTime();//获取开始时间
               // console.log(tableList.length)
            for(var i=0;i<tableList.length;i++){
                // console.log(!tableList[i].datetime,1)
                //过滤
                if(tableList[i].tick||!tableList[i].datetime||tableList[i].off)continue;
                var endTime=new Date(tableList[i].datetime).getTime();//获取结束时间
                if(endTime-startTime<1){
                    clearInterval($(obj)[0].timer);
                    playmusic();     //播放音乐
                    showAlert(i);     //弹出提醒框
                }
            }
            // clearInterval($(obj)[0].timer);
        },1000)

    }
    //播放音乐
    function playmusic() {
        var music=document.getElementById("music");
        music.play()
    }
    //
    function showAlert(i) {
        $(".msg").show();
        $(".msg-content").text(tableList[i].content)
        $(".msg-btn").click(function () {
            update({off:true},i)
            $(".msg").hide();
        })
    }
    /*----------------------------clock end---------------------------*/

}())