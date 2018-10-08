var data_global;
var order_data_array;
    $(document).ready(function() {
        $(".images-ids").contextmenu(function() {
            return false;
        });
        if($(".images img").length >0) {
            $(".upload-box").hide();
            $("#steps").show();
            $("#lbl-step-title ").text("Step 2: Organize")
        }
    });

    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };
    var images = {};
    if(jsonData.length>0){
        $.each(data, function (i, img) {
            images[i+1] = img;
        });
    }

    var existing_data = window.localStorage.getItem('data');
    var data = {"images" : images}
    var selected = new Array();
    if (!existing_data) {
        data = JSON.stringify(data);
        window.localStorage.setItem('data', data);
    }

    $( function() {
        $(".wrapper").hide();
        var order=[];
        $('#sortable > div').map(function() {
            order.push(this.id)
        })
            // To store  the order of images extracted
        var data = window.localStorage.getItem('data');
        data = JSON.parse(data)
        data["order"] = order
        data = JSON.stringify(data)
        window.localStorage.setItem('data', data);

        // To sort the images
        $("#sortable").sortable({
            revert: true,
            update: function( event, ui ) {
                var image_ids = $("#sortable").sortable("toArray");
                var data = window.localStorage.getItem('data');
                data = JSON.parse(data)
                data["order"] = image_ids
                data = JSON.stringify(data)
                window.localStorage.setItem('data', data);

            }
        });

        $( "#next-button, #book_save" ).click(function(e) {



            e.preventDefault();
            var current_step = $("#next-button ").data("current-step");

            //The first page to drag and sort the elements
            if (current_step == "drag") {

               $("#sortable" ).sortable( "disable" )
               $("#sortable" ).selectable({
                   selected: function(event, ui){
                       if ((ui.selected.id) && (!window.selected.includes(ui.selected.id))) {
                           window.selected.push(ui.selected.id);

                       }
                   },
                   unselected: function(event, ui){
                       window.selected.remove(ui.unselected.id);

                   }
               });
               $("#next-button ").data("current-step","front_cover");
               $("#lbl-step-title ").text("Step 3: Select Front Cover Images");
            }

            //To select the front_cover and store in local storage
            if (current_step == "front_cover") {


                if (window.selected.length != 2) {
                    alert("Please select  2 Front Covers");
                    return false;
                }
                var data = window.localStorage.getItem('data');
                data = JSON.parse(data)
                data["front_cover"] = window.selected
                var front_cover = data["front_cover"];
                var i;
                for (i = 0; i < front_cover.length; i++) {
                    $("#"+front_cover[i]).hide();
                    $("#"+front_cover[i]).attr("data-order","front_cover");
                }

                data = JSON.stringify(data)
                window.localStorage.setItem('data', data);
                $("#next-button ").data("current-step","back_cover");
                // reset selection
                window.selected.length = 0;
                $("div").removeClass("ui-selected");
                $("#lbl-step-title ").text("Step 4: Select Back Cover Images")
            }

            //To select the back_cover and store in local storage
            if (current_step == "back_cover") {
                var data = window.localStorage.getItem('data');
                data = JSON.parse(data)
                data["back_cover"] = window.selected
                var ws =0;
                var loops=0
                //since sometimes window.selected has a array of previous selected elements too ,
                //while loop removes , front_cover and stores back_cover alone
                while(loops< window.selected.length)
                {
                     if(data["front_cover"].includes(data["back_cover"][ws])) {
                         data["back_cover"].remove(data["back_cover"][ws])
                     }
                     loops++;
                }
                 if (data["back_cover"].length != 2) {
                    alert("Please select 2 Back Covers")
                    return false;
                }
                var back_cover = data["back_cover"];
                 for (i = 0; i < back_cover.length; i++) {
                        $("#"+back_cover[i]).hide();
                        $("#"+back_cover[i]).attr("data-order","back_cover")
                }
                 //remove selected divs
                $("div").removeClass("ui-selected");
                data = JSON.stringify(data)
                window.localStorage.setItem('data', data);
                 // reset selection
                 window.selected.length = 0;
                $("#next-button ").data("current-step","tabs");
                $("#lbl-step-title ").text("Step 5: Select Spine");
            }


            //To select the tabs and store in local storage
            if (current_step == "tabs") {
                name();
            }


            if (current_step == "refine-components") {
                $(".wrapper").hide();

                if (window.selected.length % 2 != 0) {
                    alert("Please select EVEN number Stack")
                    return false;
                }
                $("#next-button").attr("id","build-book");

            }
            window.selected.length = 0;
        });

        $( "#sortable" ).disableSelection();
      });

       function name(){

        if (window.selected.length != 1) {
            alert("Please select  1 spine and pages must be EVEN number")
            return false;
        }

        var data = window.localStorage.getItem('data');
        data = JSON.parse(data)

        var current_order =  data['order'];

          for (i = 0; i < data["back_cover"].length; i++) {
              current_order.remove(data["back_cover"][i])
          }
          for (i = 0; i < data["front_cover"].length; i++) {
              current_order.remove(data["front_cover"][i])
          }


        var ws1 =0;
        var loops1=0

        while(loops1< window.selected.length){

            if(window.selected.includes(data["back_cover"][ws1])) {
                window.selected.remove(data["back_cover"][ws1]);
            }

            if(window.selected.includes(data["front_cover"][ws1])){
                window.selected.remove(data["front_cover"][ws1]);
            }
            loops1++;
            ws1++;
        }


    var j=0;
    var l = 0;
    var k = 0;
    var tab=[];
    var stack=[];
    var new_stack = [];
    var new_tab = [];
    var is_tab = false
    var is_stack =false


    for(var i =0; i< current_order.length; i++)
    {
    if (current_order[i] == window.selected[0]){

            tab.push(current_order[i])
            // j++
            is_tab = true
    }
    else{
        stack.push(current_order[i])
      }
    }
    data["spine"] = tab;
    data["pages"] = stack;

    if(data["pages"].length %2 !=0)
    {
      alert("Pages must be  EVEN ");
      return false;
    }

    // enabling sortable before adding

    $("#sortable").sortable({
        disabled: false,
        update: function( event, ui ) {
            var image_ids = $("#sortable").sortable("toArray");
            var drag_data = ui.item.attr('data-order')
            var drag_id = ui.item.attr('id')
            var data_src = ui.item.find('img').attr('src')
            var data = window.localStorage.getItem('data');
            data = JSON.parse(data)
            data["new_order"] = image_ids
            if (drag_data=="front_cover"){
                for(var fc=1;fc<data["front_cover"].length;fc++){

                    $("#"+data["front_cover"][fc]).remove();
                    $("#"+drag_id).after(`<div id = ${data["front_cover"][fc]} class="images-ids" data-order="front_cover" class="ui-state-default" style="display: none">
                    <img src=${data_src} width="250px" height=(dimension) class="img-responsive" alt=""> </div>`);
                }
            }
            else if (drag_data=="back_cover"){
                for(var bc=1;bc<data["back_cover"].length;bc++) {
                    $("#"+data["back_cover"][bc]).remove();
                    $("#"+drag_id).after(`<div id = ${data["back_cover"][bc]} class="images-ids" data-order="back_cover" class="ui-state-default" style="display: none">
                    <img src=${data_src}  width="250px" height=(dimension) class="img-responsive" alt=""> </div>`);

                }
            }
            else{

                for(var stacks=1;stacks<data["pages"].length;stacks++){
                    $("#"+data["pages"][stacks]).remove();
                    $("#"+drag_id).after(`<div id = ${data["pages"][stacks]} class="images-ids" data-order="pages" class="ui-state-default" style="display: none">
                    <img src=${data_src}  width="250px" height=(dimension) class="img-responsive" alt=""> </div>`);
                    drag_id = data["pages"][stacks]
                }
            }
            order_send();
        }
    });
    var i;
    $("#"+data["front_cover"][0]).show();
    $("#"+data["front_cover"][0]).append(`<div><label for="name">Front Cover</label></div>`);

    $("#"+data["spine"][0]).show();
    $("#"+data["spine"][0]).attr("data-order","spine");
    $("#"+data["spine"][0]).append(`<div><label for="name">Spine</label></div>`);

    $("#"+data["pages"][0]).show();
    $("#"+data["pages"][0]).append(`<div><label for="name">Pages</label></div>`);

    $("#"+data["back_cover"][0]).show();
    $("#"+data["pages"][0]).attr("data-order","pages");
    $("#"+data["back_cover"][0]).append(`<div><label for="name">Back Cover</label></div>`);
     // show and hide tabsss
    var a= data["pages"];
    for(var i=1,p=0;i<a.length;i++) {
        $("#"+a[i]).hide();
        $("#"+a[i]).attr("data-order","pages");
    }

    // remove selected divs
    $("div").removeClass("ui-selected");
    data = JSON.stringify(data)
    window.localStorage.setItem('data', data);
    $("#next-button ").data("current-step","stack");
    // reset selection
    //window.selected = new Array();
    window.selected.length = 0;
    $("#next-button ").data("current-step","refine-components");
    $("#lbl-step-title ").text("Refine Components")
    $(".images-ids").addClass("context-menu-one");
    $("#lbl-step-title").append(`&nbsp <button name="define_book" class="orange-btn" id="define_book">Define Book Attribute</button>`);
    $("#lbl-step-title").append(`&nbsp <button name="save_btn" class="orange-btn" id="save_btn">Save</button>`);
    // $("#next-button").html("Build Book");
    $("#next-button").hide();
    $("#next-button").attr("id","build-book");
    $("#sortable").append(`<div class="add-btn-div"><button name="add_btn" id="add_btn"> Add + </button></div>`);
    $("#add_btn").addClass("context-menu-two");
    $(".images-ids").bind("contextmenu",function(e){

        $(".images-ids").find(".con-menu").hide();
        $(this).find(".con-menu").show();
        $(document).mouseup(function(e){

            var container = $(".con-menu");
            // if the target of the click isn't the container nor a descendant of the container
            if (!container.parent().is(e.target) && container.parent().has(e.target).length === 0) {
                container.hide();
            }
        });

        $(".images-ids").click(function(e){
            var container = $(".con-menu");

            // if the target of the click isn't the container nor a descendant of the container
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                container.hide();
            }
        });
    });

    order_send();
    function order_send(){

        var values = $("#sortable div.images-ids").map(function() {
            return $(this).attr('data-order')
        }).get()
        var data_order_values = Array.from((new Set(values)))
        data_global = window.localStorage.getItem('data');
        data_global = JSON.parse(data_global)
        order_data_array=[]

        for( var s=0 ;s<data_order_values.length;s++){
            if( data_order_values[s].startsWith('spine')){
                var last_char = parseInt(data_order_values[s].slice(-1))-1;
                var order_data_array1 = {};
                order_data_array1[data_order_values[s]] = data_global['spine'][last_char]
                order_data_array.push(order_data_array1)
            }
            else if( data_order_values[s].startsWith('page')){
                var last_char = parseInt(data_order_values[s].slice(-1))-1;
                var order_data_array2 = {};
                order_data_array2[data_order_values[s]] = data_global['pages'][last_char];
                order_data_array.push(order_data_array2)
            }
            else {
                var data_ord = data_order_values[s]
                if(data_order_values[s]=="front_cover"){
                var order_data_array3 = {};
                order_data_array3[data_order_values[s]] = data_global['front_cover']
                    order_data_array.push(order_data_array3)
                }
                else {
                    var order_data_array4 = {};
                    order_data_array4[data_order_values[s]] = data_global['back_cover']
                    order_data_array.push(order_data_array4)
                }
            }
        }
        window.localStorage.setItem("new_order", JSON.stringify(order_data_array))
    }

    $(".con-menu .del-btn").click(function() {
        $(this).parent().parent().hide();
        var del_element =  $(this).parent().parent().attr('id');
        var data = window.localStorage.getItem('data');
        data = JSON.parse(data)
        var del_index = data['order'].indexOf(del_element);
        data['order'].splice(del_index,2)
        data = JSON.stringify(data)
        window.localStorage.setItem('data', data);
    });
}
