const fs=require('fs')
const handlebars=require('handlebars')
const pdf=require('html-pdf')


module.exports={
    pdfcreate: (html, replacements, options, cb) => {
        //reads html file
        fs.readFile(html, {encoding: 'utf-8'}, async (err, readHTML) => {
            if(err){
                // console.log(err)
                throw err
            }
            else{
                // compiles html file and replaces fields
                let template = await handlebars.compile(readHTML);
                let htmlToPdf = template(replacements);

                // creates pdf stream from html
                return pdf.create(htmlToPdf, options).toStream(async (err, stream) => {
                    if(err){
                        // console.log(err)
                        throw err
                    }
                    else{
                        return cb(stream)
                    }
                });
            }
        })
    }
}