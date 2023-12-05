export function stringToHtml(str){
    if(!str){
        return "";
    }
    let res = str.replace(/\r\n([ \t]*\r\n)+/, '<p>');
    res = res.replaceAll(/\r\n([ \t]*\r\n)+/g, '</p><p>').replaceAll('\r\n', '<br />');
    
    if(str.indexOf('\r\n\r\n')>-1){
        res += '</p>';
    }
    
    return res;
}

export function htmlToString(html){
    if(!html){
        return "";
    }
    let res = html.replaceAll('<p>', '\r\n\r\n').replaceAll('<br />', '\r\n').replaceAll('</p>', '');
    return res;
}