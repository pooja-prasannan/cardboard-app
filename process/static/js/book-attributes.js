$(document).ready(function() {

    var clone_div;
        $(document).on("click", '#define_book', function(e){

                $("#next-button ").data("current-step","set-book-attributes");
                $("#lbl-step-title ").text("Set Book Attributes");
                $("#lbl-step-title").append(`&nbsp <button name="back_to_refinement" class="orange-btn" id="back_to_refine">Back</button>`);
                $("#next-button").attr("id","build-book");
                $("#build-book").hide();
                $("#build-book").html("Build Book");
                $("#imgInp").hide();
                $("#sortable").hide();

                 if(status && !$('#copy').html()){
                 $("#copy").html(
                    `<div class="page-items">
                     <span>Book Thickness <input type="number" name="book-thickness" value=${json_datas.book_thickness} id="book-thickness" maxlength="4">%</span>
                     <span>Book Height <input type="number" name="book_height" value=${json_datas.book_height} id="book-height" maxlength="4"></span>
                     <span>Book Width <input type="number" name="book_width" value=${json_datas.book_width} id="book-width" maxlength="4"></span>

                     <span>Material Type <select name="material_type" id="material_type">
                        <option   value="gold" id="gold">Gold</option>
                        <option   value="silver" id="silver">Silver</option>
                        <option   value="brass" id="brass">Brass</option>
                    </select></span>
                    </div>
                    <div class="page-items">
                    <span> R1 <input type="number" name="r1" value=${json_datas.r1} id="r1" maxlength="4"></span>
                     <span>R2 <input type="number" name="r2" value=${json_datas.r2} id="r2" maxlength="4"></span>
                     <span>R3 <input type="number" name="r3" value=${json_datas.r3} id="r3" maxlength="4"></span>
                     <span>R4 <input type="number" name="r4" value=${json_datas.r4} id="r4" maxlength="4"></span>
                     <span>Hex value <input type="number" name="hex_value" value=${json_datas.hex_value} id="hex_value"></span>

                    </div>
                    <div class="custom-books">
                            <div class="paper-style">
                                <div class="paper"></div>
                                <div class="rings" id="id_rings"></div>
                            </div>
                        <hr/>
                            <div class="side">
                                 <h2>Side</h2>
                                 <div class="thickness"></div>
                            </div>
                    </div>`);
                 }
                  else{
                 $("#copy").show();
                 var selectedMaterial = $("#material_type").val();
                 $("#material_type").val(selectedMaterial);
                 }


                if( !$('#copy').html()){
                var ratio = height/width;
                 var roundedHeight = +(ratio*8.5).toFixed(2);
                    $("#copy").html(
                    `<div class="page-items">
                     <span>Book Thickness <input type="number" name="book-thickness" value=".5" id="book-thickness" maxlength="4">%</span>
                     <span>Book Height <input type="number" name="book_height" value=${roundedHeight} id="book-height" maxlength="4"></span>
                     <span>Book Width <input type="number" name="book_width" value="8.5" id="book-width" maxlength="4"></span>


                     <span>Material Type <select name="material_type" id="material_type">
                        <option   value="gold" id="gold">Gold</option>
                        <option   value="silver" id="silver">Silver</option>
                        <option   value="brass" id="brass">Brass</option>
                    </select></span>

                    <span> R1 <input type="number" name="r1" value="0" id="r1" maxlength="4"></span>
                    <span>R2 <input type="number" name="r2" value="0" id="r2" maxlength="4"></span>
                    <span>R3 <input type="number" name="r3" value="0" id="r3" maxlength="4"></span>
                    <span>R4 <input type="number" name="r4" value="0" id="r4" maxlength="4"></span>
                    <span>Hex value <input  name="hex_value" value="#ffff" id="hex_value"></span>

                    </div>


                    <div class="custom-books">

                            <div class="paper-style">
                                <div class="paper"></div>
                                <div class="rings" id="id_rings"></div>

                            </div>
                        <hr/>
                            <div class="side">
                                 <h2>Side</h2>
                                 <div class="thickness"></div>
                            </div>

                    </div>`);
                    setTimeout(function(){
                        $(".thickness").css({"width": 600/ratio});
                        $(".paper").css({"width": 600/ratio});
                         $(".side").css({"width": 600/ratio});
                     },500);
            }

            else{
                $("#copy").show();
                var selectedMaterial = $("#material_type").val();
                $("#material_type").val(selectedMaterial);
                setTimeout(function(){
                        $(".thickness").css({"width": 600/$('book-height').val()/$('book-width').val()});
                        $(".paper").css({"width": 600/$('book-height').val()/$('book-width').val()});
                         $(".side").css({"width": 600/$('book-height').val()/$('book-width').val()});
                     },500);
            }

            setTimeout(function(){
             var data = window.localStorage.getItem('data');
                data = JSON.parse(data)
                var front_page = data["front_cover"][0];
                var front_page_src = $("#"+front_page ).find('img').attr("src");

                $(".paper").css({
                    "background-image":"url("+front_page_src+")"
                })

            $(".rings").empty();
            var ratio = height/width;
            var roundedHeight = +(ratio*$("#book-width").val()).toFixed(2);
//            $("#book-height").val(roundedHeight);
            $(".tabs-tags").empty();
            var r1 = $("#r1").val();
            var r2 = $("#r2").val();
            var r3 = $("#r3").val();
            var r4 = $("#r4").val();

            var bookthick = $("#book-thickness").val();
            var paperhgt = $(".paper").height();
            var bookWdth = $("#book-width").val();
            var bookHgt = $("#book-height").val();

            $(".thickness").height(bookthick*50);
            $(".paper").css({"width": (bookWdth/bookHgt)*600});
            $(".side").css({"width": (bookWdth/bookHgt)*600});
            $(".paper").css({"border-top-right-radius": 6 * r1 +"px"});
            $(".paper").css({"border-bottom-right-radius":6 * r2 +"px"});
            $(".paper").css({"border-top-left-radius": 6 * r3 +"px"});
            $(".paper").css({"border-bottom-left-radius":6 * r4+"px"});
            var r1 = $("#r1").val();
            var r2 = $("#r2").val();
            var r3 = $("#r3").val();
            var r4 = $("#r4").val();

            $("input").bind("keyup",function(){
                var r1 = $("#r1").val();
                var r2 = $("#r2").val();
                var r3 = $("#r3").val();
                var r4 = $("#r4").val();
                var bookWdth = $("#book-width").val();
                var bookHgt = $("#book-height").val();
                var paperhgt = $(".paper").height();
                var bookthick = $("#book-thickness").val();
                $(".paper").css({"width": (bookWdth/bookHgt)*600});
                $(".side").css({"width": (bookWdth/bookHgt)*600});
                $(".thickness").css({"width": (bookWdth/bookHgt)*600})
                $(".thickness").height(bookthick*50);
                $(".paper").css({"border-top-right-radius": 6 * r1 +"px"});
                $(".paper").css({"border-bottom-right-radius":6 * r2 +"px"});
                $(".paper").css({"border-top-left-radius": 6 * r3 +"px"});
                $(".paper").css({"border-bottom-left-radius":6 * r4+"px"});
                var bookWidth = $("#book-width").val();
                var bookWidth = $("#book-width").val();

            });
            var paperhgt = $(".paper").height();
            },500)
        })

             $(document).on("click", '#build-book', function(e){
                 var book_width =$("#book-width").val();
                 var book_height =$("#book-height").val();
                 var book_thickness = $('#book-thickness').val();
                 var hex_value=$('#hex_value').val();
                 var material_type = $("#material_type option:selected").val();
                 var r1 = $("#r1").val();
                 var r2 = $("#r2").val();
                 var r3 = $("#r3").val();
                 var r4 = $("#r4").val();
                 console.log("logsssss",book_width,book_height,book_thickness,material_type,r1,r2,r3,r4);


                 var final_data={
                 "book_width":book_width,
                 "book_height":book_height,
                 "book_thickness":book_thickness,
                 "material_type":material_type,
                 "hex_value":hex_value,
                 "r1":r1,
                 "r2":r2,
                 "r3":r3,
                 "r4":r4
                }
                var formdata ={ "book_attribute":final_data,
                                "upload_id":upload_id,
                                "merge_image":window.localStorage.getItem('data')
                }

                

              // Use `jQuery.ajax` method
              $.ajax('/merge-images/', {
                method: "POST",
                data: JSON.stringify(formdata ),

                processData: false,
                contentType: false,
                success(data) {
                console.log(data);
                    $('#sortable').show()
                },
                error() {
                  console.log('Upload error');
                },
              });
             });


            $(document).on("click", '#back_to_refine', function(e){

              $("#copy").hide();
              $("#build-book").show();
              $("#lbl-step-title ").text("Refine Components");

              $("#lbl-step-title").append(`&nbsp <button name="define_book" class="orange-btn" id="define_book">Define Book Attribute</button>`);
              $("#lbl-step-title").append(`&nbsp <button name="save_btn" class="orange-btn" id="save_btn">Save</button>`);
              $("#sortable").show();
            });

            $(document).on("click", '#build-book', function(e){

              $("#tab-shows").hide();
              $("#copy").hide();

              $("#lbl-step-title ").text("Refine Components");
              $("#next-button").show();;
              $("#lbl-step-title").append(`&nbsp <button name="define_book" class="orange-btn" id="define_book">Define Book Attribute</button>`);
              $("#lbl-step-title").append(`&nbsp <button name="save_btn" class="orange-btn" id="save_btn">Save</button>`);
              $("#sortable").show();

            });
    });
