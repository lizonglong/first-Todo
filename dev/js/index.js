!function(){function t(t){k.push(t),store.set("xx",k)}function e(){var t=$(".task-list");t.html(null);for(var e=[],a=0;a<k.length;a++)if(k[a].tick)e[a]=k[a];else{var c=n(k[a],a);t.prepend(c),m(c)}for(var l=0;l<e.length;l++)e[l]&&((c=n(e[l],l)).addClass("deleteline"),t.append(c));i(),s(),f()}function n(t,e){var n='<li data-index="'+e+'" ><input type="checkbox" class="complate" '+(t.tick?"checked":"")+'><p class="content">'+t.content+'</p><div class="right"><span class="delete r-main">删除</span><span class="detail r-main">详细</span></div></li>';return $(n)}function i(){$(".delete.r-main").on("click",function(){var t=$(this);$(".Alert").show(),$(".primary.confirm").bind("click",function(){$(".Alert").hide(),a(t.parent().parent().data("index")),$(".primary.confirm").unbind("click")}),$(".cancel").click(function(){$(".Alert").hide()})})}function a(t){k.splice(t,1),c()}function c(){store.set("xx",k),e()}function s(){$(".detail.r-main").on("click",function(){var t=$(this).parent().parent().data("index");l(k[t],t)})}function l(t,e){var n='<div class="task-detail-mask"></div><div class="task-detail"><form class="up-task"><h2 class="content">'+t.content+'</h2><div class="input-item"><input type="text" class="dbContent"></div><div class="input-item"><textarea class="text">'+(t.text||"")+'</textarea></div><div class="remind input-item"><label for="b">提醒时间</label><input id="b" class="datetime" type="text" value="'+(t.datetime?t.datetime:"")+'"></div><div class="input-item"><button>更新</button></div><div class="close">X</div></form></div>';$(".container").append(n),$.datetimepicker.setLocale("ch"),$(".datetime").datetimepicker(),o(),d(e),r()}function o(){$(".task-detail-mask,.close").on("click",function(){$(".task-detail-mask,.task-detail").remove()})}function d(t){$(".up-task").on("submit",function(n){n.preventDefault();var i={};i.content=$(this).find(".content").text(),i.text=$(this).find(".text").val(),i.datetime=$(this).find(".datetime").val(),u(i,t),$(".task-detail-mask,.task-detail").remove(),e()})}function r(){$(".up-task .content").on("dblclick",function(){var t=$(this),e=$(".container .up-task .dbContent");t.hide(),e.show(),e.focus(),e.on("blur",function(){console.log(1),t.show(),e.hide(),e.val()&&t.text($(this).val())})})}function u(t,e){k[e]=$.extend({},k[e],t),store.set("xx",k)}function f(){var t=$(".complate");$(".container .task-list li");t.on("click",function(){var t=$(this).parent().data("index");k[t].tick?u({tick:!1},t):u({tick:!0},t),e()})}function m(t){$(t)[0]&&(clearInterval($(t)[0].timer),$(t)[0].timer=setInterval(function(){for(var e=(new Date).getTime(),n=0;n<k.length;n++)k[n].tick||!k[n].datetime||k[n].off||new Date(k[n].datetime).getTime()-e<1&&(clearInterval($(t)[0].timer),v(),p(n))},1e3))}function v(){document.getElementById("music").play()}function p(t){$(".msg").show(),$(".msg-content").text(k[t].content),$(".msg-btn").click(function(){u({off:!0},t),$(".msg").hide()})}var k=[],h=$(".add-task");k=store.get("xx")||[],e(),m(),h.on("submit",function(n){n.preventDefault();var i={};i.content=h.find("input").eq(0).val(),i.content&&(t(i),e(),h.find("input").eq(0).val(null))})}();