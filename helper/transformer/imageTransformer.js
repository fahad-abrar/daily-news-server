import FileHelper from "../profileFileHelper.js";



class imageTransformer{
    static transform(news){
        return {
            id: news.id,
            heading: news.title,
            news: news.content,
            image:FileHelper.imageUrl(news.image)

        }
    }
}

export default imageTransformer