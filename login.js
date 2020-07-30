let http = require('http')
let querystring=require('querystring');
let hash = require('./hashes.min.js')
let crypto = require('crypto');
let os = require('os')
let fs = require('fs')


config = JSON.parse(fs.readFileSync('./config.json'))

function getIPv4(){ // 有的时候这个方法会出错，做法是将 return IPv4 改为 return '你的真实 ip'
 
    let IPv4 = ""
    for(var i=0;i<os.networkInterfaces().enp4s0.length;i++){  
        if(os.networkInterfaces().enp4s0[i].family=='IPv4'){  
            IPv4=os.networkInterfaces().enp4s0[i].address;  
        }  
    }
    return IPv4  
}

config.ip = getIPv4()


function sha1(text){
    return crypto.createHash('sha1').update(text).digest('hex');
}



function xEncode( str, key ) {
    if(str=="") {
        return "";
    }
    var v = s(str, true),
        k = s(key, false);
    if(k.length<4) {
        k.length=4;
    }
    var n=v.length-1,
        z=v[n],
        y=v[0],
        c=0x86014019|0x183639A0,
        m,
        e,
        p,
        q=Math.floor(6+52/(n+1)),
        d=0;
    while (0<q--) {
        d=d+c&(0x8CE0D9BF|0x731F2640);
        e=d>>>2&3;
        for(p=0;p<n;p++) {
            y=v[p+1];
            m=z>>>5^y<<2;
            m+=(y>>>3^z<<4)^(d^y);
            m+=k[(p&3)^e]^z;
            z=v[p]=v[p]+m&(0xEFB8D130|0x10472ECF);
        }
        y=v[0];
        m=z>>>5^y<<2;
        m+=(y>>>3^z<<4)^(d^y);
        m+=k[(p&3)^e]^z;
        z=v[n]=v[n]+m&(0xBB390742|0x44C6F8BD);
    }

    function s(a,b) {
        var c=a.length,v=[];
        for(var i=0;i<c;i+=4) {
            v[i>>2]=a.charCodeAt(i)|a.charCodeAt(i+1)<<8|a.charCodeAt(i+2)<<16|a.charCodeAt(i+3)<<24;
        }
        if(b) {
            v[v.length]=c;
        }
        return v;
    }

    function l(a,b) {
        var d=a.length,c=(d-1)<<2;
        if(b) {
            var m=a[d-1];
            if((m<c-3)||(m>c))
                return null;
            c = m;
        }
        for (var i=0;i<d;i++) {
            a[i]=String.fromCharCode(a[i]&0xff,a[i]>>>8&0xff,a[i]>>>16&0xff,a[i]>>>24&0xff);
        }
        if(b) {
            return a.join('').substring(0, c);
        } else {
            return a.join('');
        }
    }

    return l(v, false);
}







url = '10.0.0.55'

postdata = {
    "action": "login",
    "username": config.username,
    "password": config.password,
    "ac_id": "1",
    "ip": config.ip
}


headers = {
    'User-Agent': `Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko)
                  Chrome/45.0.2454.85 Safari/537.36 115Browser/6.0.3`,
    'Referer': 'http://www.baidu.com',
    'Connection': 'keep-alive'
}


let up = require('url')

function get(data){
    let enc = 'srun_bx1'
    let n = 200
    let type = 1
    let token = data.challenge
    let t=postdata
    let $data = t
    

    info = (xEncode(JSON.stringify({"username":$data.username, "password":$data.password, "ip":$data.ip, "acid":$data.ac_id, "enc_ver":enc}), token))
    info = new hash.Base64().encode(info)

    $data.info = "{SRBX1}"+info;
    var hmd5 = new hash.MD5().hex_hmac(token, data.password);
    $data.password = "{MD5}"+hmd5;
    $data.chksum = sha1(token+$data.username+token+hmd5+token+$data.ac_id+token+$data.ip+token+n+token+type+token+$data.info);
    $data.n = n;
    $data.type = type;

    par = querystring.stringify($data)

    url = '10.0.0.55'
    path = '/cgi-bin/srun_portal?'+par

    console.log(path)

    var options={  
        host:url,  
        port:80,  
        path:path,  
        method:'POST',
        headers:{  
     
        }  
     } 

     http.get(options, (res) => {
        const { statusCode } = res;
        console.log(statusCode)
      
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          console.log(rawData)
        });
      }).on('error', (e) => {
        console.error(`错误: ${e.message}`);
      });

}



postData=querystring.stringify(postdata);  
var options={  
   host:url,  
   port:80,  
   path:`/cgi-bin/get_challenge?callback=jsonp152854227095&username=${config.username}&ip=${getIPv4()}`,  //jsonp152854227095有的时候会认证失败，做法是你先用网页端登陆一下在 chrome 查看 URL后的这个 jsonp 后面的数值，填上就好了
   method:'POST',
   headers:{  

   }  
}  
var req=http.request(options, function(res) {  
  
    res.setEncoding('utf-8'); 
    
    data = ""
    res.on('data',function(a){  
        data += a

    });  
    res.on('end',function(){
        data = data.split('(')[1].replace(')','')
        data = JSON.parse(data)
        console.log()
        get(data)  
    });  
});  
req.on('error',function(err){  
    console.error(err);  
});  
req.write(postData);  
req.end(); 

