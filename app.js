/**
 *
 * Created by linux-top on 15-4-9.
 */

    //[编辑]
    //$("*").on("click","",function(){
    //    //双击变成可编辑
    //   $(".node").removeAttr("contentEditable");
    //});

    var k=0.5;
    //[标识]当前
    $("*").on("click",".node",function(){
        //任何node-DIV被单击都会变成活动元素:
        $(".node").removeClass("active");
        $(this).addClass("active");
        $(this).attr("contentEditable",true);
    });
    //[可拖动]
    $("*").on("mouseover",".node",function(){
        //鼠标所到之处,div都变的"可拖动";
        $(this).draggable();
    });
    //[正在拖动...]
    $("*").on("mousemove","div",function(){
        var _this=this;
        $("path[father="+$(this).attr("id")+"]").each(function(){
            console.log($(this));
            $(this).attr("d",flushPath(_this,"div[id="+$(this).attr("id")+"]",k));
        });
        //曲线动画;
        $("path[id="+$(this).attr("id")+"]").attr("d",flushPath("div[id="+$(this).attr("father")+"]",this,k));
    });

$(document).ready(function(){
    var _id=1;//每个节点[div]、曲线[svg path]的ID产生器;
    $("#addNode").button().on("click",function(){
        //[添加结点]
        //console.log("正在为活动元素添加内容...");
        //1:给当前元素添加一个ID为"_id"的<div>;
        $(".active").createNodeObj(++_id);
        //2:为其生成曲线;
        createCurve(".active","#"+_id,k,_id);
    });
});
    function createCurve(_filter1,_filter2,_k,_cId){
        //path的html母体结构修改：
        _pathStr="<svg><path id="+_cId+" d='"+flushPath(_filter1,_filter2,_k)+"' father='"+$(_filter1).attr("id")+"' stroke='red' fill='none' style='stroke-width: 2px'></path></svg>";
        $("body").append(_pathStr);
		//$("svg").attr("id","svgid");
        //console.log(_pathStr+"|建立在"+_filter1+"和"+_filter2+"之间");
    }
	
    function flushPath(filter1,filter2,k) {
		//console.log($(filter1));
		//console.log($(filter2));
        //起点1：---------------------------------------------------------------//
        var x0 = $(filter1).position().left + $(filter1).outerWidth()/2;
        var y0 = $(filter1).position().top + $(filter1).outerHeight()/2;
        //末点4：---------------------------------------------------------------//
        var x3 = $(filter2).position().left + $(filter2).outerWidth()/2;
        var y3 = $(filter2).position().top + $(filter2).outerHeight()/2;
        //控制点1---------------------------------------------------------------//
        var x1 = x0 + (x3 - x0) * k;
        var y1 = y0;
        //控制点2---------------------------------------------------------------//
        var x2 = x3 - (x3 - x0) * k;
        var y2 = y3;
        //---------------------------------------------------------------------//
        var _dStr = "M" + x0 + "," + y0 + " C" + x1 + "," + y1 + "," + x2 + "," + y2 + "," + x3 + "," + y3;
        //console.log("path的d参数："+_dStr);
        return _dStr;
    }

    //拓展jQ对象功能：[添加div]
    $.fn.createNodeObj=function(_id){

        //node的html母体结构修改：
        _nodeStr="<div id='"+_id+"' class='node "+this.attr("id")+"' father='"+this.attr("id")+"'>"+_id+"</div>";

        //节点的添加方式【1.平行after】【2.内部append】
        $(this).after(_nodeStr);
        //$(this).append(_nodeStr);
        //内部append方式，定位方式...
    }