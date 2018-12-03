import os
import base64
import uuid
import json
from PIL import Image
from django.conf import settings
from django.views import View
from django.shortcuts import render
from django.http import JsonResponse
from pdf2image import convert_from_bytes


class CovertView(View):
    def get(self, request):
        return render(request, 'process/index.html')

    def post(self, request):
        try:
            file = request.FILES['file']
            images = convert_from_bytes(file.read(), dpi=72, fmt='png')
            width, height = images[0].size
            img_path_list = []
            i = 1
            
            uniqueID = str(uuid.uuid4())[:5]

            upload_id = (os.path.splitext(file.name)[0]) + "_" + uniqueID
            
            


            folder = "{}/upload/{}".format(settings.MEDIA_ROOT, str(upload_id))

            try:
                os.mkdir(folder)
                os.mkdir(folder+"/finalOutput")
            except Exception as e:
                print(e)
            for image in images:
                img_path = os.path.join(folder, "image{}.png".format(i))
                image.save(os.path.join(img_path))
                img_path_list.append(os.path.join(settings.MEDIA_URL, "upload/{}/image{}.png".format(str(upload_id),i)))
                i = i + 1

            return render(request, 'process/index.html', {
                'images': img_path_list,
                'json_images': json.dumps(img_path_list),
                'upload_id': upload_id,
                'height': height,
                'width': width
            })
        except Exception as e:
            print(e)
            return render(request, 'process/index.html')


class EditorView(View):
    def get(self, request, pk):
        image_list = []
        folder = "{}/upload/{}".format(settings.MEDIA_ROOT, pk)
        json_file = open(os.path.join(settings.MEDIA_ROOT, 'upload', pk, 'finalOutput', 'book_attribute_data.json'), 'r')
        book_attribute_data = json.load(json_file)
        for filename in os.listdir(folder):
            image_list.append(os.path.join(settings.MEDIA_URL, "upload/{}/{}".format(pk, filename)))

        return render(request, 'process/index.html', {
            'images': image_list,
            'json_images': json.dumps(image_list),
            'upload_id': pk,
            'attributes': json.dumps(book_attribute_data),
            'status': True
        })


class Base64ImageView(View):
    def get(self, request):
        return render(request, 'process/index.html')

    def post(self, request):
        try:
            json_data = json.loads(request.body.decode('utf-8'))

            if json_data.get('action') == 'edit_image':

                image_url = json_data.get('croppedImage')

                image_id = "image{}".format(json_data.get('image_ids'))
                encoded_image = image_url.split(',')[-1]
                imgdata = base64.standard_b64decode(encoded_image)

                upload_id = json_data.get('upload_id')
                image_result = open(os.path.join(settings.MEDIA_ROOT, 'upload', upload_id, image_id + '.png'), 'wb')
                # img_url = '%s%s.png' % (settings.MEDIA_URL, image_id)
                img_url = "{}upload/{}/{}.png".format(settings.MEDIA_URL, upload_id, image_id)

                image_result.write(imgdata)
                image_result.seek(0, 0)

            if json_data.get('action') == 'add_image':
                img_lis = []
                image_url_lis = json_data.get('front_cover')
                id_max = json_data.get('id_max')
                for i, img_url in enumerate(image_url_lis):
                    encoded_image = img_url.split(',')[-1]
                    image_id = "image{}".format(id_max+i+1)
                    imgdata = base64.standard_b64decode(encoded_image)
                    if 'png' in img_url:
                        image_type = '.png'
                    if 'jpeg' in img_url:
                        image_type = '.jpg'
                    upload_id = json_data.get('upload_id')
                    image_result = open(os.path.join(settings.MEDIA_ROOT, 'upload', upload_id, image_id + image_type), 'wb')
                    url = "{}upload/{}/{}{}".format(settings.MEDIA_URL, upload_id, image_id, image_type)

                    img_lis.append(url)
                    image_result.write(imgdata)
                    image_result.seek(0, 0)
                img_url = img_lis

        except Exception as e:
            img_url = ''
        return JsonResponse({'img_url': img_url})


class MergeImageView(View):

    def post(self, request):

        json_data = json.loads(request.body.decode('utf-8'))
        img_lis = []
        components = ['front_cover', 'back_cover', 'spine', 'pages']
        book_attr_data = json_data.get('book_attribute')
        upload_id = json_data.get('upload_id')

        merge_img_data = eval(json_data.get('merge_image'))
        hello_world(book_attr_data, upload_id, merge_img_data)

        save_book_attributes(book_attr_data, upload_id, merge_img_data)
        print("merge_image",merge_img_data)

        for cmp in components[:2]:

            data = merge_img_data.get(cmp)
            d = list(map(int, data))
            it = iter(d)
            for id, x in enumerate(it):
                image_id = "{}{}.png".format(cmp, id)
                try:
                    merge_image([x, next(it)], image_id, upload_id)
                    url = "{}upload/{}/finalOutput/{}".format(settings.MEDIA_URL, upload_id, image_id)
                    img_lis.append(url)
                except Exception as e:
                    image_id = "{}{}.png".format(cmp, id)
                    old_image = open(os.path.join(settings.MEDIA_ROOT, 'upload', upload_id, "image{}.png".format(x)), 'rb').read()
                    new_img = open(os.path.join(settings.MEDIA_ROOT, 'upload', upload_id, 'finalOutput', image_id), 'wb')
                    new_img.write(old_image)
                    url = "{}upload/{}/finalOutput/{}".format(settings.MEDIA_URL, upload_id, image_id)
                    img_lis.append(url)

        for cmp in components[2:]:
            data = merge_img_data.get(cmp)
            d = list(map(int, data))
            it = iter(d)
            for id, x in enumerate(it):
                image_id = "{}{}.png".format(cmp, id)
                try:
                    merge_image([x, next(it)], image_id, upload_id)
                    url = "{}upload/{}/finalOutput/{}".format(settings.MEDIA_URL, upload_id, image_id)
                    img_lis.append(url)
                except Exception as e:
                    image_id = "{}{}.png".format(cmp, id)
                    old_image = open(os.path.join(settings.MEDIA_ROOT, 'upload', upload_id, "image{}.png".format(x)),
                                     'rb').read()
                    new_img = open(os.path.join(settings.MEDIA_ROOT, 'upload', upload_id, 'finalOutput', image_id),
                                   'wb')
                    new_img.write(old_image)
                    url = "{}upload/{}/finalOutput/{}".format(settings.MEDIA_URL, upload_id, image_id)
                    img_lis.append(url)

        return JsonResponse({'img_url': img_lis})


def merge_image(image_merge_list, image_id, upload_id):

    image_path_list = list(map(lambda x: os.path.join(settings.MEDIA_ROOT, 'upload', upload_id, "image"+str(x))+".png", image_merge_list))
    images = list(map(Image.open, list(image_path_list)))
    widths, heights = zip(*(i.size for i in images))
    total_width = sum(widths)
    max_height = max(heights)
    new_im = Image.new('RGB', (total_width, max_height))
    # new_im = new_im.resize((1024, 1024), Image.ANTIALIAS)#this resize the image to 1024 px

    x_offset = 0
    for im in images:
        new_im.paste(im, (x_offset, 0))
        x_offset += im.size[0]

    new_im.save(os.path.join(settings.MEDIA_ROOT, 'upload', upload_id, 'finalOutput', image_id))


def save_book_attributes(book_attr_data, upload_id, merge_img_data):
    json_file = open(os.path.join(settings.MEDIA_ROOT, 'upload', upload_id, 'finalOutput', 'book_attribute_data.json'), 'a')
    print("BOOK", book_attr_data, "MERRRR", merge_img_data)
    book_attr_data.update({'merge_images': merge_img_data})
    json.dump(book_attr_data, json_file)
    json_file.write("\n")


def hello_world(book_attr_data,upload_id, merge_img_data):

    print(book_attr_data, upload_id, merge_img_data)