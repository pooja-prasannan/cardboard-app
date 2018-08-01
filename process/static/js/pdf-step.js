$(document).ready(function() {


        if($(".images img").length >0)
        {
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
    console.log("dataaaaaaaaaaaaaaaaaaaa", jsonData);

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
          $("#sortable").sortable({
                revert: true,
                update: function( event, ui ) {
                    var image_ids = $("#sortable").sortable("toArray");
                    var data = window.localStorage.getItem('data');
                    data = JSON.parse(data)
                    data["order"] = image_ids
                    data = JSON.stringify(data)
                    window.localStorage.setItem('data', data);
                    console.log(window.localStorage.getItem('data'))
                }
            });
        $( "#next-button" ).click(function(e) {
           console.log(window.localStorage.getItem('data'))

            e.preventDefault();
            var current_step = $("#next-button ").data("current-step");
            if (current_step == "drag") {

               $("#sortable" ).sortable( "disable" )
               $("#sortable" ).selectable({
                   selected: function(event, ui){
                       if ((ui.selected.id) && (!window.selected.includes(ui.selected.id))) {
                           window.selected.push(ui.selected.id);
                           console.log("selected--->", selected);
                       }
                   },
                   unselected: function(event, ui){
                       window.selected.remove(ui.unselected.id);
                       console.log("remove--->", selected);
                   }
               });
               $("#next-button ").data("current-step","front_cover");
               $("#lbl-step-title ").text("Step 3: Select Front Cover Images");
            }
            if (current_step == "front_cover") {

                console.log("--->", selected);
                var data = window.localStorage.getItem('data');
                console.log(">>>>>>>>>>>>>>>>1111",data)
                data = JSON.parse(data)
                data["front_cover"] = window.selected
                var front_cover = data["front_cover"];
                var i;
                for (i = 0; i < front_cover.length; i++) {
                        $("#"+front_cover[i]).hide();
                }
                data = JSON.stringify(data)
                window.localStorage.setItem('data', data);
                $("#next-button ").data("current-step","back_cover");
                // reset selection
                window.selected = new Array();
                $("#lbl-step-title ").text("Step 4: Select Back Cover Images")
            }
            if (current_step == "back_cover") {

                var data = window.localStorage.getItem('data');
                data = JSON.parse(data)
                data["back_cover"] = window.selected
                var back_cover = data["back_cover"];
//                var all_divs = $("div .ui-state-default")
//                var i;
//                console.log(data["images"].length)
//                for (var key  in data["images"]){
//                        $("#"+key).hide();
//                }
                 for (i = 0; i < back_cover.length; i++) {
                        $("#"+back_cover[i]).hide();
                }
                // remove selected divs
//                $("div").removeClass("ui-selected");
                data = JSON.stringify(data)
                window.localStorage.setItem('data', data);
                $("#next-button ").data("current-step","tabs");
                // reset selection
                window.selected = new Array();
                $("#lbl-step-title ").text("Step 5: Select Tabs");

            }
            if (current_step == "tabs") {

                if (window.selected.length % 2 != 0) {
                    alert("Please select EVEN number Tabs")
                    return false;
                }
                var data = window.localStorage.getItem('data');
                data = JSON.parse(data)
                //data["tabs"] = window.selected
                var current_order =  data['order'];
                console.log(current_order)
                  for (i = 0; i < data["back_cover"].length; i++) {
                      current_order.remove(data["back_cover"][i])
                  }
                  for (i = 0; i < data["front_cover"].length; i++) {
                      current_order.remove(data["front_cover"][i])
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
            if (current_order[i] == window.selected[j]){
                    if (is_stack){
                        new_tab.push([tab])
                        tab =[]
                        is_stack=false}
                    tab.push(current_order[i])
                    j++
                    is_tab = true
            }
            else{
                if (is_tab){
                    new_stack.push([stack])
                    stack =[]
                    is_tab = false
                    is_stack = true
                }
                stack.push(current_order[i])
            }
            if ( i == current_order.length - 1){
                    new_tab.push([tab])
                    new_stack.push([stack])
            }
            }
            data["total_tabs"] = new_tab;
            data["total_stacks"] = new_stack
            for (i=0;i< data["total_tabs"].length;i++){
//              for(j=0; j< data["total_tabs"][i].length;j++){
                console.log("ffff",data["total_tabs"][i][0][0])

//               }
            }
            console.log("order",current_order)
                var i;
                console.log("tab length",data["tabs"].length)
//                for (var key  in data["order"]+1){
//                        $("#"+key).show();
//                }

                $("#"+data["front_cover"][0]).show();
                 $("#"+data["front_cover"][0]).append(`<div><label for="name">Front</label></div>`);

                 for (i=0,j=0;i< data["total_tabs"].length;i++) {
                     $("#"+data["total_tabs"][i][0][0]).show();
                     $("#"+data["total_tabs"][i][0][0]).append(`<div><label for="name">tab ${j+1} </label></div>`);
                     j=j+1;
                     $("#"+data["total_tabs"][i][0][1]).hide();
               }
                for (i=0,j=0;i< data["total_stacks"].length;i++) {
                     $("#"+data["total_stacks"][i][0][0]).show();
                     $("#"+data["total_stacks"][i][0][0]).append(`<div><label for="name">stack ${j+1} </label></div>`);
                     j=j+1;
                     $("#"+data["total_stacks"][i][0][1]).hide();
               }

                $("#"+data["back_cover"][0]).show();
                $("#"+data["back_cover"][0]).append(`<div><label for="name">Back</label></div>`);

                // remove selected divs
                $("div").removeClass("ui-selected");
                data = JSON.stringify(data)
                window.localStorage.setItem('data', data);
                $("#next-button ").data("current-step","stack");
                // reset selection
                window.selected = new Array();
                $("#next-button ").data("current-step","refine-components");
                $("#lbl-step-title ").text("Step 6: Refine Components")
                $(".abc").addClass("context-menu-one");
                $("#lbl-step-title").append(`&nbsp <button name="save" class="orange-btn" id="save-button">Save</button>`);
                $("#next-button").html(`<button name="build" class="orange-btn " data-current-step="drag" id="build">Build Book</button>`);
                $("#sortable").append(`<button name="book_attribute" class="orange-btn"  id="book_attribute">Define Book Attribute</button>`)

            }
            if (current_step == "refine-components") {
                if (window.selected.length % 2 != 0) {
                    alert("Please select EVEN number Stack")
                    return false;
                }
            }
        });

        $( "#sortable" ).disableSelection();
//        $(".ui-selectable img").click(function()
//        {
//            $(this).toggleClass("selected");
//        });
      });