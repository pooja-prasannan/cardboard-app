var base64data=[];
var temp_total_tabs =[];
var temp_total_stacks =[];
var max;
var max1;
var keys;

    $(function() {

                max=0;
                $('.images-ids').each(function()
                 {
                var value = parseInt($(this).attr('id'));
                global_max = (value > max) ? value : max;
                 });

        $.contextMenu({
            selector: '.context-menu-two',
            trigger: 'left',
          determinePosition: function($menu){

        $menu.css('display', 'block')
            .position({ my: "center top", at: "center bottom", of: this, offset: "0 5"})
            .css('display', 'none');
    },

            callback: function(key, options) {
                if( key== "front" || key == "back" )
                {
                keys = key;
                 base64data=[];
                 $("#back").empty()
                $("#back").append(` <input type='file' multiple id="imgInp" />`);

                var fileList =[];
                $("#back").off().on('change','#imgInp',function() {
                    $('#imgInp').hide();
                    if(this.files.length>2){

                    alert("only 2 files can be uploaded"+this.files.length)}
                    else{
                    readURL(this,keys);
                    base64data.length=0;
                    }

                });

                function readURL(input,keys)
                    {
                        if ( input.files.length<=2) {
                        console.log("imp",input.files)
                        var base64data=[];
                        var filesAmount = input.files.length;
                        for(var i=0;i<filesAmount;i++){
                          console.log("length",input.files[i])
                          getBase64(keys ,input, input.files[i])
                           }
                         }
                         else{
                          alert("You can upload only 2 files")
                         }
                    }

                function getBase64(keys ,input, file){

                   var reader = new FileReader();
                   reader.readAsDataURL(file);
                   reader.onload = function () {
                         base64data.push(reader.result)
                       if(base64data.length == input.files.length){
                            max1=0;
                             $('.images-ids').each(function()
                                {
                                    var value = parseInt($(this).attr('id'));
                                    max1 = (value > max1) ? value : max1;
                                });

                            var formData1 ={'front_cover':base64data, 'id_max': max1, 'action': 'add_image',
                            'upload_id':upload_id}
                            console.log("formdata",formData1)
                            $.ajax('/images/', {
                            method: "POST",
                            data: JSON.stringify(formData1),
                            processData: false,
                            contentType: false,
                            contentType: false,
                            success(datas) {
                             console.log('Upload succes',datas['img_url'].length);
                             for(var inc=0;inc<datas['img_url'].length;inc++)
                                {
                                 max=0;
                                $('.images-ids').each(function()
                                 {
                                var value = parseInt($(this).attr('id'));

                                max = (value > max) ? value : max;
                                 });

                                 var n_max = max+1
                                 var new_max =n_max.toString()
                                  data =window.localStorage.getItem('data')
                                  data = JSON.parse(data)

                                 if(key == "front"){
                                  var len = data['front_cover'].length;
                                  var parent_id = data['front_cover'][len-1];

                                 $("#"+parent_id).after(`<div id = ${new_max} class="images-ids" data-order="front_cover" class="ui-state-default">
                                  <img src="#"  width="250px"  class="img-responsive" alt=""> </div>`);
                                 $("#"+new_max).find('img').attr('src', datas['img_url'][inc]).width(250).height(dimension);

                                 $("#sortable").sortable({
                                        disabled: false,
                                        revert: true,
                                        update: function( event, ui ) {
                                            var image_ids = $("#sortable").sortable("toArray");
                                            var data = window.localStorage.getItem('data');
                                            data = JSON.parse(data)

                                            data["new_order"] = image_ids

                                            data = JSON.stringify(data)
                                            window.localStorage.setItem('data', data);
                                            console.log(window.localStorage.getItem('data'))
                                        }
                                     });

                                     var image_ids = $("#sortable").sortable("toArray");
                                     var data = window.localStorage.getItem('data');
                                     data = JSON.parse(data)
                                     data["new_order"] = image_ids
                                     data['front_cover'].push(new_max.toString())
                                     data = JSON.stringify(data)
                                     window.localStorage.setItem('data', data);
                                     console.log(window.localStorage.getItem('data'))

                                    window.localStorage.setItem('data', data);

                                 }
                                  if(key == "back"){

                                    var len = data['back_cover'].length;
                                  var parent_id = data['back_cover'][len-1];
                                 $("#"+parent_id).after(`<div id = ${new_max} class="images-ids" data-order="back_cover" class="ui-state-default">
                                  <img src="#"  width="250px"  class="img-responsive" alt=""> </div>`);
                                 $("#"+new_max).find('img').attr('src', datas['img_url'][inc]).width(250).height(dimension);
                                 $("#sortable").sortable({
                                        disabled: false,
                                        revert: true,
                                        update: function( event, ui ) {
                                            var image_ids = $("#sortable").sortable("toArray");
                                            var data = window.localStorage.getItem('data');
                                            data = JSON.parse(data)
                                            data["new_order"] = image_ids

                                            data = JSON.stringify(data)
                                            window.localStorage.setItem('data', data);
                                            console.log(window.localStorage.getItem('data'))
                                        }
                                     });

                                 var image_ids = $("#sortable").sortable("toArray");
                                 var data = window.localStorage.getItem('data');
                                 data = JSON.parse(data)
                                 data["new_order"] = image_ids
                                 data['back_cover'].push(new_max.toString())
                                 data = JSON.stringify(data)
                                 window.localStorage.setItem('data', data);
                                 console.log(window.localStorage.getItem('data'))

                                data = JSON.stringify(data)
                                window.localStorage.setItem('data', data);

                                 }
                                 if(inc%2==0)
                                   {
//                                     $("#"+new_max).find("img").show();
                                     if(keys == "front"){
                                    $("#"+new_max).append(`<div><label for="name">Front Cover</label></div>`);
                                     }

                                     if(keys == "back"){

                                     $("#"+new_max).append(`<div><label for="name">Back Cover</label></div>`);
                                     }
                                   }
                                 else
                                 {
                                 $("#"+new_max).hide();
                                 }
                                 }
                                    },
                            error()
                                   {
                                      console.log('Upload error');
                                    },
                              });
                             }
                           };
                     }
                }

                 if( key== "stack")
                {

                temp_total_stacks=[];
                $("#back").empty()
                $("#back").append(` <input type='file' multiple id="imgInp" />`);
                var fileList =[];
                $("#back").off().on('change','#imgInp',function() {
                    readURL(this);
                    base64data.length=0;
                    $('#imgInp').show();
                    $('#imgInp').hide();

                });

                function readURL(input)
                    {

                        if ( input.files.length%2==0) {
                        console.log("imp",input.files)
                        var base64data=[];
                        var filesAmount = input.files.length;
                        for(var i=0;i<filesAmount;i++){

                          console.log("length",input.files[i])
                          getBase64(input, input.files[i])

                           }
                         }
                         else{
                           alert("You must upload  EVEN number of files")
                         return false;
                         }
                    }

                function getBase64(input, file){

                   var reader = new FileReader();
                   reader.readAsDataURL(file);
                   reader.onload = function () {
                         base64data.push(reader.result)

                       if(base64data.length == input.files.length){

                          max1=0;
                             $('.images-ids').each(function()
                                {
                                    var value = parseInt($(this).attr('id'));
                                    max1 = (value > max1) ? value : max1;
                                });

                            var formData1 ={'front_cover':base64data, 'id_max': max1, 'action': 'add_image','upload_id':upload_id}
                            console.log("formdata",formData1)
                            $.ajax('/images/', {
                            method: "POST",
                            data: JSON.stringify(formData1),
                            processData: false,
                            contentType: false,
                            success(datas) {
                             console.log('Upload succes',datas['img_url'].length);
                             for(var inc=0;inc<datas['img_url'].length;inc++)
                                {

                                     max=0;
                                    $('.images-ids').each(function()
                                     {
                                    var value = parseInt($(this).attr('id'));

                                    max = (value > max) ? value : max;
                                     });
                                     var n_max = max+1
                                 var new_max =n_max.toString()
//                                  data =window.localStorage.getItem('data')
//                                  data = JSON.parse(data)


                                      $("#"+global_max).after(` <div id = ${new_max} class="images-ids"  class="ui-state-default">
                                      <img src="#" class="img-responsive" alt=""> </div>`)
                                     $("#"+new_max).find('img').attr('src', datas['img_url'][inc]).width(250).height(dimension);

                                    temp_total_stacks.push(new_max)
                                     $("#sortable").sortable({
                                        disabled: false,
                                        revert: true,
                                        update: function( event, ui ) {
                                            var image_ids = $("#sortable").sortable("toArray");
                                            var data = window.localStorage.getItem('data');
                                            data = JSON.parse(data)
                                            data["new_order"] = image_ids
                                            data = JSON.stringify(data)
                                            window.localStorage.setItem('data', data);
                                            console.log(window.localStorage.getItem('data'))
                                            }
                                         });

                                         var image_ids = $("#sortable").sortable("toArray");
                                         var data = window.localStorage.getItem('data');
                                         data = JSON.parse(data)
                                         data["new_order"] = image_ids
                                         data['total_stacks'].push([new_max.toString()])
                                         data = JSON.stringify(data)
                                         window.localStorage.setItem('data', data);
                                         console.log(window.localStorage.getItem('data'))
                                     if(inc==0)
                                       {
                                         $("#"+new_max).find("img").show();
                                         $("#"+new_max).append(`<div><label for="name">Stack</label></div>`);

                                       }
                                     else
                                     {
                                     $("#"+new_max).hide();
                                     }
                                 }

                                 data =window.localStorage.getItem('data')
                                 data = JSON.parse(data)

                                 data = JSON.stringify(data)
                                 window.localStorage.setItem('data', data);
                                    },
                            error()
                                   {
                                      console.log('Upload error');
                                    },
                              });
                             }
                           };
                     }

                }

                 if( key== "tab")
                {

                  temp_total_tabs =[];
                 $("#back").empty()
                keys=key;
                $("#back").append(` <input type='file' multiple id="imgInp" />`);
                var fileList =[];
                $("#back").off().on('change','#imgInp',function() {

                    readURL_stack(this,keys);
                    base64data.length=0;
                    base64data=[]
                });

                function readURL_stack(input, keys)
                    {

                        if ( input.files.length%2==0) {
                        console.log("imp",input.files)
                        var base64data=[];
                        var filesAmount = input.files.length;
                        for(var i=0;i<filesAmount;i++){
                          console.log("length",input.files[i])
                          getBase64_stack(keys,input, input.files[i])

                           }
                         }
                         else{
                           alert("You must upload  EVEN number of files")
                            return false;
                         }
                    }

                function getBase64_stack(keys, input, file){

                   var reader = new FileReader();
                   reader.readAsDataURL(file);
                   reader.onload = function () {
                         base64data.push(reader.result)

                       if(base64data.length == input.files.length){
                            max1=0;
                             $('.images-ids').each(function()
                                {
                                    var value = parseInt($(this).attr('id'));
                                    max1 = (value > max1) ? value : max1;
                                });

                            var formData1 ={'front_cover':base64data, 'id_max': max1, 'action': 'add_image','upload_id':upload_id}
                            console.log("formdata644",formData1)
                            $.ajax('/images/', {
                            method: "POST",
                            data: JSON.stringify(formData1),
                            processData: false,
                            contentType: false,
                            success(datas) {
                             console.log('Upload succes',datas['img_url'].length);


                             for(var inc=0;inc<datas['img_url'].length;inc++)
                                {

                                 max=0;
                                $('.images-ids').each(function()
                                 {
                                var value = parseInt($(this).attr('id'));

                                max = (value > max) ? value : max;
                                 });

                                 var n_max = max+1
                                 var new_max =n_max.toString()

                                     $("#"+global_max).after(` <div id = ${new_max} class="images-ids"  class="ui-state-default">
                                      <img src="#" class="img-responsive" alt=""> </div>`)
                                     $("#"+new_max).find('img').attr('src', datas['img_url'][inc]).width(250).height(dimension);



                                         $("#sortable").sortable({
                                            disabled: false,
                                            revert: true,
                                            update: function( event, ui ) {
                                                var image_ids = $("#sortable").sortable("toArray");
                                                var data = window.localStorage.getItem('data');
                                                data = JSON.parse(data)
                                                data["new_order"] = image_ids

                                                data = JSON.stringify(data)
                                                window.localStorage.setItem('data', data);
                                                console.log(window.localStorage.getItem('data'))
                                            }
                                         });

                                         var image_ids = $("#sortable").sortable("toArray");
                                         var data = window.localStorage.getItem('data');
                                         data = JSON.parse(data)
                                         data["new_order"] = image_ids
                                         data['total_tabs'].push([new_max.toString()])
                                         data = JSON.stringify(data)
                                         window.localStorage.setItem('data', data);
                                         console.log(window.localStorage.getItem('data'))

                                         temp_total_tabs.push(new_max)

                                     if(inc%2==0)
                                       {
                                         $("#"+new_max).find("img").show();
                                         $("#"+new_max).append(`<div><label for="name">Spine</label></div>`);

                                       }
                                     else
                                     {
                                     $("#"+new_max).hide();
                                     }

                                 }

                                 data =window.localStorage.getItem('data')
                                 data = JSON.parse(data)
                                 data['total_tabs'].push(temp_total_tabs)
                                 data = JSON.stringify(data)
                                 window.localStorage.setItem('data', data);
                                    },
                            error()
                                   {
                                      console.log('Upload error');
                                    },
                              });

                             }
                           };
                     }
                }

            },
            items: {
                "front": {name: "Front Cover"},
                "stack": {name: "Pages"},
                "tab": {name: "Spine"},
                "back": {name: "Back Cover"},


            }
        });

        $('#add_btn').on('click', function(e){
            console.log('clicked', this);
        })
    });
