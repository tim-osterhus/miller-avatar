var ad=0,wc=1,ld=2;var Ac=1,cd=2,Hn=3,In=0,Ot=1,Yt=2,pi=0,zi=1,Rc=2,Cc=3,Pc=4,ud=5,Si=100,hd=101,dd=102,fd=103,pd=104,md=200,gd=201,_d=202,vd=203,ea=204,ta=205,yd=206,xd=207,Md=208,Ed=209,bd=210,Sd=211,Td=212,wd=213,Ad=214,ya=0,xa=1,Ma=2,Gi=3,Ea=4,ba=5,Sa=6,Ta=7,Ic=0,Rd=1,Cd=2,mi=0,Pd=1,Id=2,Ld=3,Dd=4,Nd=5,Ud=6,Od=7,vc="attached",Fd="detached",Lc=300,Ki=301,Qi=302,wa=303,Aa=304,io=306,Ti=1e3,Un=1001,Ir=1002,Nt=1003,Ra=1004;var er=1005;var Xt=1006,Gr=1007;var Ln=1008;var ln=1009,Dc=1010,Nc=1011,Wr=1012,Ca=1013,Ai=1014,yn=1015,Xr=1016,Pa=1017,Ia=1018,qr=1020,Uc=35902,Oc=35899,Fc=1021,Bc=1022,jt=1023,Lr=1026,Yr=1027,La=1028,Da=1029,kc=1030,Na=1031;var Ua=1033,ro=33776,so=33777,oo=33778,ao=33779,Oa=35840,Fa=35841,Ba=35842,ka=35843,Ha=36196,Va=37492,za=37496,Ga=37808,Wa=37809,Xa=37810,qa=37811,Ya=37812,ja=37813,Za=37814,$a=37815,Ja=37816,Ka=37817,Qa=37818,el=37819,tl=37820,nl=37821,il=36492,rl=36494,sl=36495,ol=36283,al=36284,ll=36285,cl=36286,ul=2200,hl=2201,Bd=2202,Wi=2300,Xi=2301,Qo=2302,Hi=2400,Vi=2401,Cs=2402,dl=2500,kd=2501,Hc=0,lo=1,jr=2,Hd=3200,Vd=3201;var co=0,zd=1,gi="",Tt="srgb",Ut="srgb-linear",Ps="linear",ot="srgb";var ki=7680;var yc=519,Gd=512,Wd=513,Xd=514,Vc=515,qd=516,Yd=517,jd=518,Zd=519,na=35044,zc=35048;var Gc="300 es",Cn=2e3,Is=2001;var Fn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}},Ft=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Th=1234567,As=Math.PI/180,qi=180/Math.PI;function Pn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ft[i&255]+Ft[i>>8&255]+Ft[i>>16&255]+Ft[i>>24&255]+"-"+Ft[e&255]+Ft[e>>8&255]+"-"+Ft[e>>16&15|64]+Ft[e>>24&255]+"-"+Ft[t&63|128]+Ft[t>>8&255]+"-"+Ft[t>>16&255]+Ft[t>>24&255]+Ft[n&255]+Ft[n>>8&255]+Ft[n>>16&255]+Ft[n>>24&255]).toLowerCase()}function qe(i,e,t){return Math.max(e,Math.min(t,i))}function Wc(i,e){return(i%e+e)%e}function Jm(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function Km(i,e,t){return i!==e?(t-i)/(e-i):0}function Rs(i,e,t){return(1-t)*i+t*e}function Qm(i,e,t,n){return Rs(i,e,1-Math.exp(-t*n))}function eg(i,e=1){return e-Math.abs(Wc(i,e*2)-e)}function tg(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function ng(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function ig(i,e){return i+Math.floor(Math.random()*(e-i+1))}function rg(i,e){return i+Math.random()*(e-i)}function sg(i){return i*(.5-Math.random())}function og(i){i!==void 0&&(Th=i);let e=Th+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ag(i){return i*As}function lg(i){return i*qi}function cg(i){return(i&i-1)===0&&i!==0}function ug(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function hg(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function dg(i,e,t,n,r){let s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+n)/2),u=o((e+n)/2),h=s((e-n)/2),d=o((e-n)/2),f=s((n-e)/2),g=o((n-e)/2);switch(r){case"XYX":i.set(a*u,l*h,l*d,a*c);break;case"YZY":i.set(l*d,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*d,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*f,a*c);break;case"YXY":i.set(l*f,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*f,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Rn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function st(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Ne={DEG2RAD:As,RAD2DEG:qi,generateUUID:Pn,clamp:qe,euclideanModulo:Wc,mapLinear:Jm,inverseLerp:Km,lerp:Rs,damp:Qm,pingpong:eg,smoothstep:tg,smootherstep:ng,randInt:ig,randFloat:rg,randFloatSpread:sg,seededRandom:og,degToRad:ag,radToDeg:lg,isPowerOfTwo:cg,ceilPowerOfTwo:ug,floorPowerOfTwo:hg,setQuaternionFromProperEuler:dg,normalize:st,denormalize:Rn},Le=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*r+e.x,this.y=s*r+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ie=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,o,a){let l=n[r+0],c=n[r+1],u=n[r+2],h=n[r+3],d=s[o+0],f=s[o+1],g=s[o+2],_=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(h!==_||l!==d||c!==f||u!==g){let m=1-a,p=l*d+c*f+u*g+h*_,T=p>=0?1:-1,b=1-p*p;if(b>Number.EPSILON){let A=Math.sqrt(b),w=Math.atan2(A,p*T);m=Math.sin(m*w)/A,a=Math.sin(a*w)/A}let y=a*T;if(l=l*m+d*y,c=c*m+f*y,u=u*m+g*y,h=h*m+_*y,m===1-a){let A=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=A,c*=A,u*=A,h*=A}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,r,s,o){let a=n[r],l=n[r+1],c=n[r+2],u=n[r+3],h=s[o],d=s[o+1],f=s[o+2],g=s[o+3];return e[t]=a*g+u*h+l*f-c*d,e[t+1]=l*g+u*d+c*h-a*f,e[t+2]=c*g+u*f+a*d-l*h,e[t+3]=u*g-a*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(r/2),h=a(s/2),d=l(n/2),f=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"YZX":this._x=d*u*h+c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h-d*f*g;break;case"XZY":this._x=d*u*h-c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=n+a+h;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(o-r)*f}else if(n>a&&n>h){let f=2*Math.sqrt(1+n-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+c)/f}else if(a>h){let f=2*Math.sqrt(1+a-n-h);this._w=(s-c)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+h-n-a);this._w=(o-r)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-n*c,this._z=s*u+o*c+n*l-r*a,this._w=o*u-n*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,r=this._y,s=this._z,o=this._w,a=o*e._w+n*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*r+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}let c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},S=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(wh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(wh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*n),u=2*(a*t-s*r),h=2*(s*n-o*t);return this.x=t+l*c+o*h-a*u,this.y=n+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-n*l,this.z=n*a-r*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Xl.copy(this).projectOnVector(e),this.sub(Xl)}reflect(e){return this.sub(Xl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Xl=new S,wh=new ie,Re=class i{constructor(e,t,n,r,s,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,l,c)}set(e,t,n,r,s,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],g=n[8],_=r[0],m=r[3],p=r[6],T=r[1],b=r[4],y=r[7],A=r[2],w=r[5],C=r[8];return s[0]=o*_+a*T+l*A,s[3]=o*m+a*b+l*w,s[6]=o*p+a*y+l*C,s[1]=c*_+u*T+h*A,s[4]=c*m+u*b+h*w,s[7]=c*p+u*y+h*C,s[2]=d*_+f*T+g*A,s[5]=d*m+f*b+g*w,s[8]=d*p+f*y+g*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*s*u+n*a*l+r*s*c-r*o*l}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,d=a*l-u*s,f=c*s-o*l,g=t*h+n*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=h*_,e[1]=(r*c-u*n)*_,e[2]=(a*n-r*o)*_,e[3]=d*_,e[4]=(u*t-r*l)*_,e[5]=(r*s-a*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*s)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(ql.makeScale(e,t)),this}rotate(e){return this.premultiply(ql.makeRotation(-e)),this}translate(e,t){return this.premultiply(ql.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},ql=new Re;function Xc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Dr(i){return document.createElementNS("http:"+"//www.w3.org/1999/xhtml",i)}function $d(){let i=Dr("canvas");return i.style.display="block",i}var Ah={};function Nr(i){i in Ah||(Ah[i]=!0,console.warn(i))}function Jd(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}var Rh=new Re().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ch=new Re().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function fg(){let i={enabled:!0,workingColorSpace:Ut,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===ot&&(r.r=ii(r.r),r.g=ii(r.g),r.b=ii(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ot&&(r.r=Pr(r.r),r.g=Pr(r.g),r.b=Pr(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===gi?Ps:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Nr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Nr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ut]:{primaries:e,whitePoint:n,transfer:Ps,toXYZ:Rh,fromXYZ:Ch,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Tt},outputColorSpaceConfig:{drawingBufferColorSpace:Tt}},[Tt]:{primaries:e,whitePoint:n,transfer:ot,toXYZ:Rh,fromXYZ:Ch,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Tt}}}),i}var Ze=fg();function ii(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Pr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var gr,ia=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{gr===void 0&&(gr=Dr("canvas")),gr.width=e.width,gr.height=e.height;let r=gr.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=gr}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Dr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=ii(s[o]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ii(t[n]/255)*255):t[n]=ii(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},pg=0,Ur=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:pg++}),this.uuid=Pn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Yl(r[o].image)):s.push(Yl(r[o]))}else s=Yl(r);n.url=s}return t||(e.images[this.uuid]=n),n}};function Yl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ia.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var mg=0,jl=new S,wt=class i extends Fn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Un,r=Un,s=Xt,o=Ln,a=jt,l=ln,c=i.DEFAULT_ANISOTROPY,u=gi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:mg++}),this.uuid=Pn(),this.name="",this.source=new Ur(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Le(0,0),this.repeat=new Le(1,1),this.center=new Le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Re,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(jl).x}get height(){return this.source.getSize(jl).y}get depth(){return this.source.getSize(jl).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Lc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ti:e.x=e.x-Math.floor(e.x);break;case Un:e.x=e.x<0?0:1;break;case Ir:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ti:e.y=e.y-Math.floor(e.y);break;case Un:e.y=e.y<0?0:1;break;case Ir:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};wt.DEFAULT_IMAGE=null;wt.DEFAULT_MAPPING=Lc;wt.DEFAULT_ANISOTROPY=1;var et=class i{constructor(e=0,t=0,n=0,r=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s,l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let b=(c+1)/2,y=(f+1)/2,A=(p+1)/2,w=(u+d)/4,C=(h+_)/4,L=(g+m)/4;return b>y&&b>A?b<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(b),r=w/n,s=C/n):y>A?y<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),n=w/r,s=L/r):A<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(A),n=C/s,r=L/s),this.set(n,r,s,t),this}let T=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(T)<.001&&(T=1),this.x=(m-g)/T,this.y=(h-_)/T,this.z=(d-u)/T,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this.w=qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this.w=qe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ra=class extends Fn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new et(0,0,e,t),this.scissorTest=!1,this.viewport=new et(0,0,e,t);let r={width:e,height:t,depth:n.depth},s=new wt(r);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Xt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let r=Object.assign({},e.textures[t].image);this.textures[t].source=new Ur(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},mn=class extends ra{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ls=class extends wt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Nt,this.minFilter=Nt,this.wrapR=Un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var sa=class extends wt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Nt,this.minFilter=Nt,this.wrapR=Un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var kt=class{constructor(e=new S(1/0,1/0,1/0),t=new S(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Tn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Tn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Tn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Tn):Tn.fromBufferAttribute(s,o),Tn.applyMatrix4(e.matrixWorld),this.expandByPoint(Tn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Co.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Co.copy(n.boundingBox)),Co.applyMatrix4(e.matrixWorld),this.union(Co)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Tn),Tn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ys),Po.subVectors(this.max,ys),_r.subVectors(e.a,ys),vr.subVectors(e.b,ys),yr.subVectors(e.c,ys),_i.subVectors(vr,_r),vi.subVectors(yr,vr),Ui.subVectors(_r,yr);let t=[0,-_i.z,_i.y,0,-vi.z,vi.y,0,-Ui.z,Ui.y,_i.z,0,-_i.x,vi.z,0,-vi.x,Ui.z,0,-Ui.x,-_i.y,_i.x,0,-vi.y,vi.x,0,-Ui.y,Ui.x,0];return!Zl(t,_r,vr,yr,Po)||(t=[1,0,0,0,1,0,0,0,1],!Zl(t,_r,vr,yr,Po))?!1:(Io.crossVectors(_i,vi),t=[Io.x,Io.y,Io.z],Zl(t,_r,vr,yr,Po))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Tn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Tn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Jn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Jn=[new S,new S,new S,new S,new S,new S,new S,new S],Tn=new S,Co=new kt,_r=new S,vr=new S,yr=new S,_i=new S,vi=new S,Ui=new S,ys=new S,Po=new S,Io=new S,Oi=new S;function Zl(i,e,t,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){Oi.fromArray(i,s);let a=r.x*Math.abs(Oi.x)+r.y*Math.abs(Oi.y)+r.z*Math.abs(Oi.z),l=e.dot(Oi),c=t.dot(Oi),u=n.dot(Oi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var gg=new kt,xs=new S,$l=new S,Jt=class{constructor(e=new S,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):gg.setFromPoints(e).getCenter(n);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;xs.subVectors(e,this.center);let t=xs.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(xs,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):($l.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(xs.copy(e.center).add($l)),this.expandByPoint(xs.copy(e.center).sub($l))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Kn=new S,Jl=new S,Lo=new S,yi=new S,Kl=new S,Do=new S,Ql=new S,Yi=class{constructor(e=new S,t=new S(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Kn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Kn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Kn.copy(this.origin).addScaledVector(this.direction,t),Kn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Jl.copy(e).add(t).multiplyScalar(.5),Lo.copy(t).sub(e).normalize(),yi.copy(this.origin).sub(Jl);let s=e.distanceTo(t)*.5,o=-this.direction.dot(Lo),a=yi.dot(this.direction),l=-yi.dot(Lo),c=yi.lengthSq(),u=Math.abs(1-o*o),h,d,f,g;if(u>0)if(h=o*l-a,d=o*a-l,g=s*u,h>=0)if(d>=-g)if(d<=g){let _=1/u;h*=_,d*=_,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Jl).addScaledVector(Lo,d),f}intersectSphere(e,t){Kn.subVectors(e.center,this.origin);let n=Kn.dot(this.direction),r=Kn.dot(Kn)-n*n,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,o,a,l,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),n>l||a>r)||((a>n||n!==n)&&(n=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Kn)!==null}intersectTriangle(e,t,n,r,s){Kl.subVectors(t,e),Do.subVectors(n,e),Ql.crossVectors(Kl,Do);let o=this.direction.dot(Ql),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;yi.subVectors(this.origin,e);let l=a*this.direction.dot(Do.crossVectors(yi,Do));if(l<0)return null;let c=a*this.direction.dot(Kl.cross(yi));if(c<0||l+c>o)return null;let u=-a*yi.dot(Ql);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Me=class i{constructor(e,t,n,r,s,o,a,l,c,u,h,d,f,g,_,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,l,c,u,h,d,f,g,_,m)}set(e,t,n,r,s,o,a,l,c,u,h,d,f,g,_,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,r=1/xr.setFromMatrixColumn(e,0).length(),s=1/xr.setFromMatrixColumn(e,1).length(),o=1/xr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,s=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){let d=o*u,f=o*h,g=a*u,_=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+g*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*u,f=l*h,g=c*u,_=c*h;t[0]=d+_*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*u,f=l*h,g=c*u,_=c*h;t[0]=d-_*a,t[4]=-o*h,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*u,f=o*h,g=a*u,_=a*h;t[0]=l*u,t[4]=g*c-f,t[8]=d*c+_,t[1]=l*h,t[5]=_*c+d,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=_-d*h,t[8]=g*h+f,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*h+g,t[10]=d-_*h}else if(e.order==="XZY"){let d=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+_,t[5]=o*u,t[9]=f*h-g,t[2]=g*h-f,t[6]=a*u,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(_g,e,vg)}lookAt(e,t,n){let r=this.elements;return rn.subVectors(e,t),rn.lengthSq()===0&&(rn.z=1),rn.normalize(),xi.crossVectors(n,rn),xi.lengthSq()===0&&(Math.abs(n.z)===1?rn.x+=1e-4:rn.z+=1e-4,rn.normalize(),xi.crossVectors(n,rn)),xi.normalize(),No.crossVectors(rn,xi),r[0]=xi.x,r[4]=No.x,r[8]=rn.x,r[1]=xi.y,r[5]=No.y,r[9]=rn.y,r[2]=xi.z,r[6]=No.z,r[10]=rn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],T=n[3],b=n[7],y=n[11],A=n[15],w=r[0],C=r[4],L=r[8],E=r[12],M=r[1],P=r[5],F=r[9],V=r[13],X=r[2],j=r[6],z=r[10],K=r[14],H=r[3],ae=r[7],re=r[11],Ae=r[15];return s[0]=o*w+a*M+l*X+c*H,s[4]=o*C+a*P+l*j+c*ae,s[8]=o*L+a*F+l*z+c*re,s[12]=o*E+a*V+l*K+c*Ae,s[1]=u*w+h*M+d*X+f*H,s[5]=u*C+h*P+d*j+f*ae,s[9]=u*L+h*F+d*z+f*re,s[13]=u*E+h*V+d*K+f*Ae,s[2]=g*w+_*M+m*X+p*H,s[6]=g*C+_*P+m*j+p*ae,s[10]=g*L+_*F+m*z+p*re,s[14]=g*E+_*V+m*K+p*Ae,s[3]=T*w+b*M+y*X+A*H,s[7]=T*C+b*P+y*j+A*ae,s[11]=T*L+b*F+y*z+A*re,s[15]=T*E+b*V+y*K+A*Ae,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+s*l*h-r*c*h-s*a*d+n*c*d+r*a*f-n*l*f)+_*(+t*l*f-t*c*d+s*o*d-r*o*f+r*c*u-s*l*u)+m*(+t*c*h-t*a*f-s*o*h+n*o*f+s*a*u-n*c*u)+p*(-r*a*u-t*l*h+t*a*d+r*o*h-n*o*d+n*l*u)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],T=h*m*c-_*d*c+_*l*f-a*m*f-h*l*p+a*d*p,b=g*d*c-u*m*c-g*l*f+o*m*f+u*l*p-o*d*p,y=u*_*c-g*h*c+g*a*f-o*_*f-u*a*p+o*h*p,A=g*h*l-u*_*l-g*a*d+o*_*d+u*a*m-o*h*m,w=t*T+n*b+r*y+s*A;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/w;return e[0]=T*C,e[1]=(_*d*s-h*m*s-_*r*f+n*m*f+h*r*p-n*d*p)*C,e[2]=(a*m*s-_*l*s+_*r*c-n*m*c-a*r*p+n*l*p)*C,e[3]=(h*l*s-a*d*s-h*r*c+n*d*c+a*r*f-n*l*f)*C,e[4]=b*C,e[5]=(u*m*s-g*d*s+g*r*f-t*m*f-u*r*p+t*d*p)*C,e[6]=(g*l*s-o*m*s-g*r*c+t*m*c+o*r*p-t*l*p)*C,e[7]=(o*d*s-u*l*s+u*r*c-t*d*c-o*r*f+t*l*f)*C,e[8]=y*C,e[9]=(g*h*s-u*_*s-g*n*f+t*_*f+u*n*p-t*h*p)*C,e[10]=(o*_*s-g*a*s+g*n*c-t*_*c-o*n*p+t*a*p)*C,e[11]=(u*a*s-o*h*s-u*n*c+t*h*c+o*n*f-t*a*f)*C,e[12]=A*C,e[13]=(u*_*r-g*h*r+g*n*d-t*_*d-u*n*m+t*h*m)*C,e[14]=(g*a*r-o*_*r-g*n*l+t*_*l+o*n*m-t*a*m)*C,e[15]=(o*h*r-u*a*r+u*n*l-t*h*l-o*n*d+t*a*d)*C,this}scale(e){let t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),s=1-n,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+n,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+n,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,o){return this.set(1,n,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,h=a+a,d=s*c,f=s*u,g=s*h,_=o*u,m=o*h,p=a*h,T=l*c,b=l*u,y=l*h,A=n.x,w=n.y,C=n.z;return r[0]=(1-(_+p))*A,r[1]=(f+y)*A,r[2]=(g-b)*A,r[3]=0,r[4]=(f-y)*w,r[5]=(1-(d+p))*w,r[6]=(m+T)*w,r[7]=0,r[8]=(g+b)*C,r[9]=(m-T)*C,r[10]=(1-(d+_))*C,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements,s=xr.set(r[0],r[1],r[2]).length(),o=xr.set(r[4],r[5],r[6]).length(),a=xr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],wn.copy(this);let c=1/s,u=1/o,h=1/a;return wn.elements[0]*=c,wn.elements[1]*=c,wn.elements[2]*=c,wn.elements[4]*=u,wn.elements[5]*=u,wn.elements[6]*=u,wn.elements[8]*=h,wn.elements[9]*=h,wn.elements[10]*=h,t.setFromRotationMatrix(wn),n.x=s,n.y=o,n.z=a,this}makePerspective(e,t,n,r,s,o,a=Cn,l=!1){let c=this.elements,u=2*s/(t-e),h=2*s/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),g,_;if(l)g=s/(o-s),_=o*s/(o-s);else if(a===Cn)g=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===Is)g=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,s,o,a=Cn,l=!1){let c=this.elements,u=2/(t-e),h=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),g,_;if(l)g=1/(o-s),_=o/(o-s);else if(a===Cn)g=-2/(o-s),_=-(o+s)/(o-s);else if(a===Is)g=-1/(o-s),_=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},xr=new S,wn=new Me,_g=new S(0,0,0),vg=new S(1,1,1),xi=new S,No=new S,rn=new S,Ph=new Me,Ih=new ie,xt=class i{constructor(e=0,t=0,n=0,r=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],d=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(qe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-qe(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ph.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ph,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ih.setFromEuler(this),this.setFromQuaternion(Ih,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};xt.DEFAULT_ORDER="XYZ";var Ds=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},yg=0,Lh=new S,Mr=new ie,Qn=new Me,Uo=new S,Ms=new S,xg=new S,Mg=new ie,Dh=new S(1,0,0),Nh=new S(0,1,0),Uh=new S(0,0,1),Oh={type:"added"},Eg={type:"removed"},Er={type:"childadded",child:null},ec={type:"childremoved",child:null},$e=class i extends Fn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:yg++}),this.uuid=Pn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new S,t=new xt,n=new ie,r=new S(1,1,1);function s(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Me},normalMatrix:{value:new Re}}),this.matrix=new Me,this.matrixWorld=new Me,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ds,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Mr.setFromAxisAngle(e,t),this.quaternion.multiply(Mr),this}rotateOnWorldAxis(e,t){return Mr.setFromAxisAngle(e,t),this.quaternion.premultiply(Mr),this}rotateX(e){return this.rotateOnAxis(Dh,e)}rotateY(e){return this.rotateOnAxis(Nh,e)}rotateZ(e){return this.rotateOnAxis(Uh,e)}translateOnAxis(e,t){return Lh.copy(e).applyQuaternion(this.quaternion),this.position.add(Lh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Dh,e)}translateY(e){return this.translateOnAxis(Nh,e)}translateZ(e){return this.translateOnAxis(Uh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Qn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Uo.copy(e):Uo.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Ms.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Qn.lookAt(Ms,Uo,this.up):Qn.lookAt(Uo,Ms,this.up),this.quaternion.setFromRotationMatrix(Qn),r&&(Qn.extractRotation(r.matrixWorld),Mr.setFromRotationMatrix(Qn),this.quaternion.premultiply(Mr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Oh),Er.child=e,this.dispatchEvent(Er),Er.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Eg),ec.child=e,this.dispatchEvent(ec),ec.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Qn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Qn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Qn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Oh),Er.child=e,this.dispatchEvent(Er),Er.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ms,e,xg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ms,Mg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=r,n;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let r=e.children[n];this.add(r.clone())}return this}};$e.DEFAULT_UP=new S(0,1,0);$e.DEFAULT_MATRIX_AUTO_UPDATE=!0;$e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var An=new S,ei=new S,tc=new S,ti=new S,br=new S,Sr=new S,Fh=new S,nc=new S,ic=new S,rc=new S,sc=new et,oc=new et,ac=new et,bi=class i{constructor(e=new S,t=new S,n=new S){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),An.subVectors(e,t),r.cross(An);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){An.subVectors(r,t),ei.subVectors(n,t),tc.subVectors(e,t);let o=An.dot(An),a=An.dot(ei),l=An.dot(tc),c=ei.dot(ei),u=ei.dot(tc),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;let d=1/h,f=(c*l-a*u)*d,g=(o*u-a*l)*d;return s.set(1-f-g,g,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,ti)===null?!1:ti.x>=0&&ti.y>=0&&ti.x+ti.y<=1}static getInterpolation(e,t,n,r,s,o,a,l){return this.getBarycoord(e,t,n,r,ti)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,ti.x),l.addScaledVector(o,ti.y),l.addScaledVector(a,ti.z),l)}static getInterpolatedAttribute(e,t,n,r,s,o){return sc.setScalar(0),oc.setScalar(0),ac.setScalar(0),sc.fromBufferAttribute(e,t),oc.fromBufferAttribute(e,n),ac.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(sc,s.x),o.addScaledVector(oc,s.y),o.addScaledVector(ac,s.z),o}static isFrontFacing(e,t,n,r){return An.subVectors(n,t),ei.subVectors(e,t),An.cross(ei).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return An.subVectors(this.c,this.b),ei.subVectors(this.a,this.b),An.cross(ei).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return i.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,s=this.c,o,a;br.subVectors(r,n),Sr.subVectors(s,n),nc.subVectors(e,n);let l=br.dot(nc),c=Sr.dot(nc);if(l<=0&&c<=0)return t.copy(n);ic.subVectors(e,r);let u=br.dot(ic),h=Sr.dot(ic);if(u>=0&&h<=u)return t.copy(r);let d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(br,o);rc.subVectors(e,s);let f=br.dot(rc),g=Sr.dot(rc);if(g>=0&&f<=g)return t.copy(s);let _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(Sr,a);let m=u*g-f*h;if(m<=0&&h-u>=0&&f-g>=0)return Fh.subVectors(s,r),a=(h-u)/(h-u+(f-g)),t.copy(r).addScaledVector(Fh,a);let p=1/(m+_+d);return o=_*p,a=d*p,t.copy(n).addScaledVector(br,o).addScaledVector(Sr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Kd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Mi={h:0,s:0,l:0},Oo={h:0,s:0,l:0};function lc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var he=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Tt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ze.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Ze.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ze.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Ze.workingColorSpace){if(e=Wc(e,1),t=qe(t,0,1),n=qe(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=lc(o,s,e+1/3),this.g=lc(o,s,e),this.b=lc(o,s,e-1/3)}return Ze.colorSpaceToWorking(this,r),this}setStyle(e,t=Tt){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Tt){let n=Kd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ii(e.r),this.g=ii(e.g),this.b=ii(e.b),this}copyLinearToSRGB(e){return this.r=Pr(e.r),this.g=Pr(e.g),this.b=Pr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Tt){return Ze.workingToColorSpace(Bt.copy(this),e),Math.round(qe(Bt.r*255,0,255))*65536+Math.round(qe(Bt.g*255,0,255))*256+Math.round(qe(Bt.b*255,0,255))}getHexString(e=Tt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ze.workingColorSpace){Ze.workingToColorSpace(Bt.copy(this),t);let n=Bt.r,r=Bt.g,s=Bt.b,o=Math.max(n,r,s),a=Math.min(n,r,s),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-n)/h+2;break;case s:l=(n-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Ze.workingColorSpace){return Ze.workingToColorSpace(Bt.copy(this),t),e.r=Bt.r,e.g=Bt.g,e.b=Bt.b,e}getStyle(e=Tt){Ze.workingToColorSpace(Bt.copy(this),e);let t=Bt.r,n=Bt.g,r=Bt.b;return e!==Tt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(Mi),this.setHSL(Mi.h+e,Mi.s+t,Mi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Mi),e.getHSL(Oo);let n=Rs(Mi.h,Oo.h,t),r=Rs(Mi.s,Oo.s,t),s=Rs(Mi.l,Oo.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Bt=new he;he.NAMES=Kd;var bg=0,Ht=class extends Fn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:bg++}),this.uuid=Pn(),this.name="",this.type="Material",this.blending=zi,this.side=In,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ea,this.blendDst=ta,this.blendEquation=Si,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new he(0,0,0),this.blendAlpha=0,this.depthFunc=Gi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=yc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ki,this.stencilZFail=ki,this.stencilZPass=ki,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==zi&&(n.blending=this.blending),this.side!==In&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ea&&(n.blendSrc=this.blendSrc),this.blendDst!==ta&&(n.blendDst=this.blendDst),this.blendEquation!==Si&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Gi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==yc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ki&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ki&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ki&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(t){let s=r(e.textures),o=r(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Kt=class extends Ht{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new he(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xt,this.combine=Ic,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var At=new S,Fo=new Le,Sg=0,Be=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Sg++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=na,this.updateRanges=[],this.gpuType=yn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Fo.fromBufferAttribute(this,t),Fo.applyMatrix3(e),this.setXY(t,Fo.x,Fo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyMatrix3(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyMatrix4(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyNormalMatrix(e),this.setXYZ(t,At.x,At.y,At.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.transformDirection(e),this.setXYZ(t,At.x,At.y,At.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Rn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=st(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Rn(t,this.array)),t}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Rn(t,this.array)),t}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Rn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Rn(t,this.array)),t}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array),r=st(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array),r=st(r,this.array),s=st(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==na&&(e.usage=this.usage),e}};var Ns=class extends Be{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Us=class extends Be{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Wt=class extends Be{constructor(e,t,n){super(new Float32Array(e),t,n)}},Tg=0,pn=new Me,cc=new $e,Tr=new S,sn=new kt,Es=new kt,Lt=new S,tt=class i extends Fn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tg++}),this.uuid=Pn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Xc(e)?Us:Ns)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Re().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return pn.makeRotationFromQuaternion(e),this.applyMatrix4(pn),this}rotateX(e){return pn.makeRotationX(e),this.applyMatrix4(pn),this}rotateY(e){return pn.makeRotationY(e),this.applyMatrix4(pn),this}rotateZ(e){return pn.makeRotationZ(e),this.applyMatrix4(pn),this}translate(e,t,n){return pn.makeTranslation(e,t,n),this.applyMatrix4(pn),this}scale(e,t,n){return pn.makeScale(e,t,n),this.applyMatrix4(pn),this}lookAt(e){return cc.lookAt(e),cc.updateMatrix(),this.applyMatrix4(cc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Tr).negate(),this.translate(Tr.x,Tr.y,Tr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Wt(n,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new kt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new S(-1/0,-1/0,-1/0),new S(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){let s=t[n];sn.setFromBufferAttribute(s),this.morphTargetsRelative?(Lt.addVectors(this.boundingBox.min,sn.min),this.boundingBox.expandByPoint(Lt),Lt.addVectors(this.boundingBox.max,sn.max),this.boundingBox.expandByPoint(Lt)):(this.boundingBox.expandByPoint(sn.min),this.boundingBox.expandByPoint(sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Jt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new S,1/0);return}if(e){let n=this.boundingSphere.center;if(sn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){let a=t[s];Es.setFromBufferAttribute(a),this.morphTargetsRelative?(Lt.addVectors(sn.min,Es.min),sn.expandByPoint(Lt),Lt.addVectors(sn.max,Es.max),sn.expandByPoint(Lt)):(sn.expandByPoint(Es.min),sn.expandByPoint(Es.max))}sn.getCenter(n);let r=0;for(let s=0,o=e.count;s<o;s++)Lt.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(Lt));if(t)for(let s=0,o=t.length;s<o;s++){let a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Lt.fromBufferAttribute(a,c),l&&(Tr.fromBufferAttribute(e,c),Lt.add(Tr)),r=Math.max(r,n.distanceToSquared(Lt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Be(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let L=0;L<n.count;L++)a[L]=new S,l[L]=new S;let c=new S,u=new S,h=new S,d=new Le,f=new Le,g=new Le,_=new S,m=new S;function p(L,E,M){c.fromBufferAttribute(n,L),u.fromBufferAttribute(n,E),h.fromBufferAttribute(n,M),d.fromBufferAttribute(s,L),f.fromBufferAttribute(s,E),g.fromBufferAttribute(s,M),u.sub(c),h.sub(c),f.sub(d),g.sub(d);let P=1/(f.x*g.y-g.x*f.y);isFinite(P)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(P),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(P),a[L].add(_),a[E].add(_),a[M].add(_),l[L].add(m),l[E].add(m),l[M].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let L=0,E=T.length;L<E;++L){let M=T[L],P=M.start,F=M.count;for(let V=P,X=P+F;V<X;V+=3)p(e.getX(V+0),e.getX(V+1),e.getX(V+2))}let b=new S,y=new S,A=new S,w=new S;function C(L){A.fromBufferAttribute(r,L),w.copy(A);let E=a[L];b.copy(E),b.sub(A.multiplyScalar(A.dot(E))).normalize(),y.crossVectors(w,E);let P=y.dot(l[L])<0?-1:1;o.setXYZW(L,b.x,b.y,b.z,P)}for(let L=0,E=T.length;L<E;++L){let M=T[L],P=M.start,F=M.count;for(let V=P,X=P+F;V<X;V+=3)C(e.getX(V+0)),C(e.getX(V+1)),C(e.getX(V+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Be(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let r=new S,s=new S,o=new S,a=new S,l=new S,c=new S,u=new S,h=new S;if(e)for(let d=0,f=e.count;d<f;d+=3){let g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Lt.fromBufferAttribute(e,t),Lt.normalize(),e.setXYZ(t,Lt.x,Lt.y,Lt.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u),f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*u;for(let p=0;p<u;p++)d[g++]=c[f++]}return new Be(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,r=this.attributes;for(let a in r){let l=r[a],c=e(l,n);t.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){let d=c[u],f=e(d,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){let f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let c in r){let u=r[c];this.setAttribute(c,u.clone(t))}let s=e.morphAttributes;for(let c in s){let u=[],h=s[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Bh=new Me,Fi=new Yi,Bo=new Jt,kh=new S,ko=new S,Ho=new S,Vo=new S,uc=new S,zo=new S,Hh=new S,Go=new S,Mt=class extends $e{constructor(e=new tt,t=new Kt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){zo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let u=a[l],h=s[l];u!==0&&(uc.fromBufferAttribute(h,e),o?zo.addScaledVector(uc,u):zo.addScaledVector(uc.sub(t),u))}t.add(zo)}return t}raycast(e,t){let n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Bo.copy(n.boundingSphere),Bo.applyMatrix4(s),Fi.copy(e.ray).recast(e.near),!(Bo.containsPoint(Fi.origin)===!1&&(Fi.intersectSphere(Bo,kh)===null||Fi.origin.distanceToSquared(kh)>(e.far-e.near)**2))&&(Bh.copy(s).invert(),Fi.copy(e.ray).applyMatrix4(Bh),!(n.boundingBox!==null&&Fi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Fi)))}_computeIntersections(e,t,n){let r,s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=o[m.materialIndex],T=Math.max(m.start,f.start),b=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let y=T,A=b;y<A;y+=3){let w=a.getX(y),C=a.getX(y+1),L=a.getX(y+2);r=Wo(this,p,e,n,c,u,h,w,C,L),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let T=a.getX(m),b=a.getX(m+1),y=a.getX(m+2);r=Wo(this,o,e,n,c,u,h,T,b,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=o[m.materialIndex],T=Math.max(m.start,f.start),b=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let y=T,A=b;y<A;y+=3){let w=y,C=y+1,L=y+2;r=Wo(this,p,e,n,c,u,h,w,C,L),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let T=m,b=m+1,y=m+2;r=Wo(this,o,e,n,c,u,h,T,b,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}};function wg(i,e,t,n,r,s,o,a){let l;if(e.side===Ot?l=n.intersectTriangle(o,s,r,!0,a):l=n.intersectTriangle(r,s,o,e.side===In,a),l===null)return null;Go.copy(a),Go.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Go);return c<t.near||c>t.far?null:{distance:c,point:Go.clone(),object:i}}function Wo(i,e,t,n,r,s,o,a,l,c){i.getVertexPosition(a,ko),i.getVertexPosition(l,Ho),i.getVertexPosition(c,Vo);let u=wg(i,e,t,n,ko,Ho,Vo,Hh);if(u){let h=new S;bi.getBarycoord(Hh,ko,Ho,Vo,h),r&&(u.uv=bi.getInterpolatedAttribute(r,a,l,c,h,new Le)),s&&(u.uv1=bi.getInterpolatedAttribute(s,a,l,c,h,new Le)),o&&(u.normal=bi.getInterpolatedAttribute(o,a,l,c,h,new S),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new S,materialIndex:0};bi.getNormal(ko,Ho,Vo,d.normal),u.face=d,u.barycoord=h}return u}var Or=class i extends tt{constructor(e=1,t=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let l=[],c=[],u=[],h=[],d=0,f=0;g("z","y","x",-1,-1,n,t,e,o,s,0),g("z","y","x",1,-1,n,t,-e,o,s,1),g("x","z","y",1,1,e,n,t,r,o,2),g("x","z","y",1,-1,e,n,-t,r,o,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new Wt(c,3)),this.setAttribute("normal",new Wt(u,3)),this.setAttribute("uv",new Wt(h,2));function g(_,m,p,T,b,y,A,w,C,L,E){let M=y/C,P=A/L,F=y/2,V=A/2,X=w/2,j=C+1,z=L+1,K=0,H=0,ae=new S;for(let re=0;re<z;re++){let Ae=re*P-V;for(let Ge=0;Ge<j;Ge++){let rt=Ge*M-F;ae[_]=rt*T,ae[m]=Ae*b,ae[p]=X,c.push(ae.x,ae.y,ae.z),ae[_]=0,ae[m]=0,ae[p]=w>0?1:-1,u.push(ae.x,ae.y,ae.z),h.push(Ge/C),h.push(1-re/L),K+=1}}for(let re=0;re<L;re++)for(let Ae=0;Ae<C;Ae++){let Ge=d+Ae+j*re,rt=d+Ae+j*(re+1),dt=d+(Ae+1)+j*(re+1),Je=d+(Ae+1)+j*re;l.push(Ge,rt,Je),l.push(rt,dt,Je),H+=6}a.addGroup(f,H,E),f+=H,d+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function tr(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function Vt(i){let e={};for(let t=0;t<i.length;t++){let n=tr(i[t]);for(let r in n)e[r]=n[r]}return e}function Ag(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function qc(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ze.workingColorSpace}var fl={clone:tr,merge:Vt},Rg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Cg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,on=class extends Ht{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Rg,this.fragmentShader=Cg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=tr(e.uniforms),this.uniformsGroups=Ag(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Os=class extends $e{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Me,this.projectionMatrix=new Me,this.projectionMatrixInverse=new Me,this.coordinateSystem=Cn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ei=new S,Vh=new Le,zh=new Le,Rt=class extends Os{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=qi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(As*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return qi*2*Math.atan(Math.tan(As*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ei.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ei.x,Ei.y).multiplyScalar(-e/Ei.z),Ei.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ei.x,Ei.y).multiplyScalar(-e/Ei.z)}getViewSize(e,t){return this.getViewBounds(e,Vh,zh),t.subVectors(zh,Vh)}setViewOffset(e,t,n,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(As*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*n/c,r*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},wr=-90,Ar=1,oa=class extends $e{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Rt(wr,Ar,e,t);r.layers=this.layers,this.add(r);let s=new Rt(wr,Ar,e,t);s.layers=this.layers,this.add(s);let o=new Rt(wr,Ar,e,t);o.layers=this.layers,this.add(o);let a=new Rt(wr,Ar,e,t);a.layers=this.layers,this.add(a);let l=new Rt(wr,Ar,e,t);l.layers=this.layers,this.add(l);let c=new Rt(wr,Ar,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,s,o,a,l]=t;for(let c of t)this.remove(c);if(e===Cn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Is)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,o),e.setRenderTarget(n,2,r),e.render(t,a),e.setRenderTarget(n,3,r),e.render(t,l),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,r),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Fs=class extends wt{constructor(e=[],t=Ki,n,r,s,o,a,l,c,u){super(e,t,n,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},aa=class extends mn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Fs(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Or(5,5,5),s=new on({name:"CubemapFromEquirect",uniforms:tr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ot,blending:pi});s.uniforms.tEquirect.value=t;let o=new Mt(r,s),a=t.minFilter;return t.minFilter===Ln&&(t.minFilter=Xt),new oa(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,r);e.setRenderTarget(s)}},_t=class extends $e{constructor(){super(),this.isGroup=!0,this.type="Group"}},Pg={type:"move"},Fr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new _t,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new _t,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new S,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new S),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new _t,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new S,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new S),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Pg)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new _t;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var Bs=class extends $e{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xt,this.environmentIntensity=1,this.environmentRotation=new xt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},ri=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=na,this.updateRanges=[],this.version=0,this.uuid=Pn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Gt=new S,si=class i{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix4(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyNormalMatrix(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.transformDirection(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Rn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=st(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Rn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Rn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Rn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Rn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array),r=st(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array),r=st(r,this.array),s=st(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Be(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var Gh=new S,Wh=new et,Xh=new et,Ig=new S,qh=new Me,Xo=new S,hc=new Jt,Yh=new Me,dc=new Yi,oi=class extends Mt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=vc,this.bindMatrix=new Me,this.bindMatrixInverse=new Me,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new kt),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Xo),this.boundingBox.expandByPoint(Xo)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Jt),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Xo),this.boundingSphere.expandByPoint(Xo)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),hc.copy(this.boundingSphere),hc.applyMatrix4(r),e.ray.intersectsSphere(hc)!==!1&&(Yh.copy(r).invert(),dc.copy(e.ray).applyMatrix4(Yh),!(this.boundingBox!==null&&dc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,dc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new et,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.fromBufferAttribute(t,n);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===vc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Fd?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,r=this.geometry;Wh.fromBufferAttribute(r.attributes.skinIndex,e),Xh.fromBufferAttribute(r.attributes.skinWeight,e),Gh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){let o=Xh.getComponent(s);if(o!==0){let a=Wh.getComponent(s);qh.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(Ig.copy(Gh).applyMatrix4(qh),o)}}return t.applyMatrix4(this.bindMatrixInverse)}},Br=class extends $e{constructor(){super(),this.isBone=!0,this.type="Bone"}},ks=class extends wt{constructor(e=null,t=1,n=1,r,s,o,a,l,c=Nt,u=Nt,h,d){super(null,o,a,l,c,u,r,s,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},jh=new Me,Lg=new Me,an=class i{constructor(e=[],t=[]){this.uuid=Pn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,r=this.bones.length;n<r;n++)this.boneInverses.push(new Me)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Me;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let s=0,o=e.length;s<o;s++){let a=e[s]?e[s].matrixWorld:Lg;jh.multiplyMatrices(a,t[s]),jh.toArray(n,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new ks(t,e,e,jt,yn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let r=this.bones[t];if(r.name===e)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,r=e.bones.length;n<r;n++){let s=e.bones[n],o=t[s];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),o=new Br),this.bones.push(o),this.boneInverses.push(new Me().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let r=0,s=t.length;r<s;r++){let o=t[r];e.bones.push(o.uuid);let a=n[r];e.boneInverses.push(a.toArray())}return e}},wi=class extends Be{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Rr=new Me,Zh=new Me,qo=[],$h=new kt,Dg=new Me,bs=new Mt,Ss=new Jt,Hs=class extends Mt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new wi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,Dg)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new kt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Rr),$h.copy(e.boundingBox).applyMatrix4(Rr),this.boundingBox.union($h)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Jt),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Rr),Ss.copy(e.boundingSphere).applyMatrix4(Rr),this.boundingSphere.union(Ss)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=n.length+1,o=e*s+1;for(let a=0;a<n.length;a++)n[a]=r[o+a]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(bs.geometry=this.geometry,bs.material=this.material,bs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ss.copy(this.boundingSphere),Ss.applyMatrix4(n),e.ray.intersectsSphere(Ss)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Rr),Zh.multiplyMatrices(n,Rr),bs.matrixWorld=Zh,bs.raycast(e,qo);for(let o=0,a=qo.length;o<a;o++){let l=qo[o];l.instanceId=s,l.object=this,t.push(l)}qo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new wi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new ks(new Float32Array(r*this.count),r,this.count,La,yn));let s=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;s[l]=a,s.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},fc=new S,Ng=new S,Ug=new Re,Nn=class{constructor(e=new S(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=fc.subVectors(n,t).cross(Ng.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(fc),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Ug.getNormalMatrix(e),r=this.coplanarPoint(fc).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Bi=new Jt,Og=new Le(.5,.5),Yo=new S,kr=class{constructor(e=new Nn,t=new Nn,n=new Nn,r=new Nn,s=new Nn,o=new Nn){this.planes=[e,t,n,r,s,o]}set(e,t,n,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Cn,n=!1){let r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],h=s[5],d=s[6],f=s[7],g=s[8],_=s[9],m=s[10],p=s[11],T=s[12],b=s[13],y=s[14],A=s[15];if(r[0].setComponents(c-o,f-u,p-g,A-T).normalize(),r[1].setComponents(c+o,f+u,p+g,A+T).normalize(),r[2].setComponents(c+a,f+h,p+_,A+b).normalize(),r[3].setComponents(c-a,f-h,p-_,A-b).normalize(),n)r[4].setComponents(l,d,m,y).normalize(),r[5].setComponents(c-l,f-d,p-m,A-y).normalize();else if(r[4].setComponents(c-l,f-d,p-m,A-y).normalize(),t===Cn)r[5].setComponents(c+l,f+d,p+m,A+y).normalize();else if(t===Is)r[5].setComponents(l,d,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Bi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Bi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Bi)}intersectsSprite(e){Bi.center.set(0,0,0);let t=Og.distanceTo(e.center);return Bi.radius=.7071067811865476+t,Bi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Bi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Yo.x=r.normal.x>0?e.max.x:e.min.x,Yo.y=r.normal.y>0?e.max.y:e.min.y,Yo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Yo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var qt=class extends Ht{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new he(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},la=new S,ca=new S,Jh=new Me,Ts=new Yi,jo=new Jt,pc=new S,Kh=new S,ai=class extends $e{constructor(e=new tt,t=new qt){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let r=1,s=t.count;r<s;r++)la.fromBufferAttribute(t,r-1),ca.fromBufferAttribute(t,r),n[r]=n[r-1],n[r]+=la.distanceTo(ca);e.setAttribute("lineDistance",new Wt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),jo.copy(n.boundingSphere),jo.applyMatrix4(r),jo.radius+=s,e.ray.intersectsSphere(jo)===!1)return;Jh.copy(r).invert(),Ts.copy(e.ray).applyMatrix4(Jh);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){let f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){let p=u.getX(_),T=u.getX(_+1),b=Zo(this,e,Ts,l,p,T,_);b&&t.push(b)}if(this.isLineLoop){let _=u.getX(g-1),m=u.getX(f),p=Zo(this,e,Ts,l,_,m,g-1);p&&t.push(p)}}else{let f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){let p=Zo(this,e,Ts,l,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){let _=Zo(this,e,Ts,l,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function Zo(i,e,t,n,r,s,o){let a=i.geometry.attributes.position;if(la.fromBufferAttribute(a,r),ca.fromBufferAttribute(a,s),t.distanceSqToSegment(la,ca,pc,Kh)>n)return;pc.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(pc);if(!(c<e.near||c>e.far))return{distance:c,point:Kh.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var Qh=new S,ed=new S,gn=class extends ai{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let r=0,s=t.count;r<s;r+=2)Qh.fromBufferAttribute(t,r),ed.fromBufferAttribute(t,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+Qh.distanceTo(ed);e.setAttribute("lineDistance",new Wt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Vs=class extends ai{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Hr=class extends Ht{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new he(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},td=new Me,xc=new Yi,$o=new Jt,Jo=new S,zs=class extends $e{constructor(e=new tt,t=new Hr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$o.copy(n.boundingSphere),$o.applyMatrix4(r),$o.radius+=s,e.ray.intersectsSphere($o)===!1)return;td.copy(r).invert(),xc.copy(e.ray).applyMatrix4(td);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,h=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=d,_=f;g<_;g++){let m=c.getX(g);Jo.fromBufferAttribute(h,m),nd(Jo,m,l,r,e,t,this)}}else{let d=Math.max(0,o.start),f=Math.min(h.count,o.start+o.count);for(let g=d,_=f;g<_;g++)Jo.fromBufferAttribute(h,g),nd(Jo,g,l,r,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function nd(i,e,t,n,r,s,o){let a=xc.distanceSqToPoint(i);if(a<t){let l=new S;xc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Gs=class extends wt{constructor(e,t,n=Ai,r,s,o,a=Nt,l=Nt,c,u=Lr,h=1){if(u!==Lr&&u!==Yr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:h};super(d,r,s,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ur(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Ws=class extends wt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var Xs=class i extends tt{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let s=e/2,o=t/2,a=Math.floor(n),l=Math.floor(r),c=a+1,u=l+1,h=e/a,d=t/l,f=[],g=[],_=[],m=[];for(let p=0;p<u;p++){let T=p*d-o;for(let b=0;b<c;b++){let y=b*h-s;g.push(y,-T,0),_.push(0,0,1),m.push(b/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let T=0;T<a;T++){let b=T+c*p,y=T+c*(p+1),A=T+1+c*(p+1),w=T+1+c*p;f.push(b,y,w),f.push(y,A,w)}this.setIndex(f),this.setAttribute("position",new Wt(g,3)),this.setAttribute("normal",new Wt(_,3)),this.setAttribute("uv",new Wt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var ji=class extends Ht{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new he(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new he(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=co,this.normalScale=new Le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Qt=class extends ji{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Le(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return qe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new he(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new he(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new he(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var ua=class extends Ht{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Hd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ha=class extends Ht{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ko(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Fg(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Bg(i){function e(r,s){return i[r]-i[s]}let t=i.length,n=new Array(t);for(let r=0;r!==t;++r)n[r]=r;return n.sort(e),n}function id(i,e,t){let n=i.length,r=new i.constructor(n);for(let s=0,o=0;o!==n;++s){let a=t[s]*e;for(let l=0;l!==e;++l)r[o++]=i[a+l]}return r}function Qd(i,e,t,n){let r=1,s=i[0];for(;s!==void 0&&s[n]===void 0;)s=i[r++];if(s===void 0)return;let o=s[n];if(o!==void 0)if(Array.isArray(o))do o=s[n],o!==void 0&&(e.push(s.time),t.push(...o)),s=i[r++];while(s!==void 0);else if(o.toArray!==void 0)do o=s[n],o!==void 0&&(e.push(s.time),o.toArray(t,t.length)),s=i[r++];while(s!==void 0);else do o=s[n],o!==void 0&&(e.push(s.time),t.push(o)),s=i[r++];while(s!==void 0)}var li=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],s=t[n-1];e:{t:{let o;n:{i:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=r,r=t[++n],e<r)break t}o=t.length;break n}if(!(e>=s)){let a=t[1];e<a&&(n=2,s=a);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(r=s,s=t[--n-1],e>=s)break t}o=n,n=0;break n}break e}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(r=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)t[o]=n[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},da=class extends li{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Hi,endingEnd:Hi}}intervalChanged_(e,t,n){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case Vi:s=e,a=2*t-n;break;case Cs:s=r.length-2,a=t+r[s]-r[s+1];break;default:s=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Vi:o=e,l=2*n-t;break;case Cs:o=1,l=n+r[1]-r[0];break;default:o=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=s*u,this._offsetNext=o*u}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-t)/(r-t),_=g*g,m=_*g,p=-d*m+2*d*_-d*g,T=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,b=(-1-f)*m+(1.5+f)*_+.5*g,y=f*m-f*_;for(let A=0;A!==a;++A)s[A]=p*o[u+A]+T*o[c+A]+b*o[l+A]+y*o[h+A];return s}},qs=class extends li{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(n-t)/(r-t),h=1-u;for(let d=0;d!==a;++d)s[d]=o[c+d]*h+o[l+d]*u;return s}},fa=class extends li{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},en=class{constructor(e,t,n,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ko(t,this.TimeBufferType),this.values=Ko(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ko(e.times,Array),values:Ko(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(n.interpolation=r)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new fa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new qs(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new da(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Wi:t=this.InterpolantFactoryMethodDiscrete;break;case Xi:t=this.InterpolantFactoryMethodLinear;break;case Qo:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Wi;case this.InterpolantFactoryMethodLinear:return Xi;case this.InterpolantFactoryMethodSmooth:return Qo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,s=0,o=r-1;for(;s!==r&&n[s]<e;)++s;for(;o!==-1&&n[o]>t;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,r=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(r!==void 0&&Fg(r))for(let a=0,l=r.length;a!==l;++a){let c=r[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Qo,s=e.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(r)l=!0;else{let h=a*n,d=h-n,f=h+n;for(let g=0;g!==n;++g){let _=t[h+g];if(_!==t[d+g]||_!==t[f+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let h=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[h+f]}++o}}if(s>0){e[o]=e[s];for(let a=s*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};en.prototype.ValueTypeName="";en.prototype.TimeBufferType=Float32Array;en.prototype.ValueBufferType=Float32Array;en.prototype.DefaultInterpolation=Xi;var ci=class extends en{constructor(e,t,n){super(e,t,n)}};ci.prototype.ValueTypeName="bool";ci.prototype.ValueBufferType=Array;ci.prototype.DefaultInterpolation=Wi;ci.prototype.InterpolantFactoryMethodLinear=void 0;ci.prototype.InterpolantFactoryMethodSmooth=void 0;var Ys=class extends en{constructor(e,t,n,r){super(e,t,n,r)}};Ys.prototype.ValueTypeName="color";var _n=class extends en{constructor(e,t,n,r){super(e,t,n,r)}};_n.prototype.ValueTypeName="number";var pa=class extends li{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(r-t),c=e*a;for(let u=c+a;c!==u;c+=4)ie.slerpFlat(s,0,o,c-a,o,c,l);return s}},vn=class extends en{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new pa(this.times,this.values,this.getValueSize(),e)}};vn.prototype.ValueTypeName="quaternion";vn.prototype.InterpolantFactoryMethodSmooth=void 0;var ui=class extends en{constructor(e,t,n){super(e,t,n)}};ui.prototype.ValueTypeName="string";ui.prototype.ValueBufferType=Array;ui.prototype.DefaultInterpolation=Wi;ui.prototype.InterpolantFactoryMethodLinear=void 0;ui.prototype.InterpolantFactoryMethodSmooth=void 0;var Bn=class extends en{constructor(e,t,n,r){super(e,t,n,r)}};Bn.prototype.ValueTypeName="vector";var hi=class{constructor(e="",t=-1,n=[],r=dl){this.name=e,this.tracks=n,this.duration=t,this.blendMode=r,this.uuid=Pn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,r=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(Hg(n[o]).scale(r));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],n=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,o=n.length;s!==o;++s)t.push(en.toJSON(n[s]));return r}static CreateFromMorphTargetSequence(e,t,n,r){let s=t.length,o=[];for(let a=0;a<s;a++){let l=[],c=[];l.push((a+s-1)%s,a,(a+1)%s),c.push(0,1,0);let u=Bg(l);l=id(l,1,u),c=id(c,1,u),!r&&l[0]===0&&(l.push(s),c.push(c[0])),o.push(new _n(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let r=e;n=r.geometry&&r.geometry.animations||r.animations}for(let r=0;r<n.length;r++)if(n[r].name===t)return n[r];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let r={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){let c=e[a],u=c.name.match(s);if(u&&u.length>1){let h=u[1],d=r[h];d||(r[h]=d=[]),d.push(c)}}let o=[];for(let a in r)o.push(this.CreateFromMorphTargetSequence(a,r[a],t,n));return o}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(h,d,f,g,_){if(f.length!==0){let m=[],p=[];Qd(f,m,p,g),m.length!==0&&_.push(new h(d,m,p))}},r=[],s=e.name||"default",o=e.fps||30,a=e.blendMode,l=e.length||-1,c=e.hierarchy||[];for(let h=0;h<c.length;h++){let d=c[h].keys;if(!(!d||d.length===0))if(d[0].morphTargets){let f={},g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let _=0;_<d[g].morphTargets.length;_++)f[d[g].morphTargets[_]]=-1;for(let _ in f){let m=[],p=[];for(let T=0;T!==d[g].morphTargets.length;++T){let b=d[g];m.push(b.time),p.push(b.morphTarget===_?1:0)}r.push(new _n(".morphTargetInfluence["+_+"]",m,p))}l=f.length*o}else{let f=".bones["+t[h].name+"]";n(Bn,f+".position",d,"pos",r),n(vn,f+".quaternion",d,"rot",r),n(Bn,f+".scale",d,"scl",r)}}return r.length===0?null:new this(s,l,r,a)}resetDuration(){let e=this.tracks,t=0;for(let n=0,r=e.length;n!==r;++n){let s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function kg(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return _n;case"vector":case"vector2":case"vector3":case"vector4":return Bn;case"color":return Ys;case"quaternion":return vn;case"bool":case"boolean":return ci;case"string":return ui}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Hg(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=kg(i.type);if(i.times===void 0){let t=[],n=[];Qd(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}var On={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},ma=class{constructor(e,t,n){let r=this,s=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){let f=c[h],g=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},ef=new ma,kn=class{constructor(e){this.manager=e!==void 0?e:ef,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};kn.DEFAULT_MATERIAL_NAME="__DEFAULT";var ni={},Mc=class extends Error{constructor(e,t){super(e),this.response=t}},Vr=class extends kn{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=On.get(`file:${e}`);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(ni[e]!==void 0){ni[e].push({onLoad:t,onProgress:n,onError:r});return}ni[e]=[],ni[e].push({onLoad:t,onProgress:n,onError:r});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=ni[e],h=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,g=f!==0,_=0,m=new ReadableStream({start(p){T();function T(){h.read().then(({done:b,value:y})=>{if(b)p.close();else{_+=y.byteLength;let A=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:f});for(let w=0,C=u.length;w<C;w++){let L=u[w];L.onProgress&&L.onProgress(A)}p.enqueue(y),T()}},b=>{p.error(b)})}}});return new Response(m)}else throw new Mc(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a==="")return c.text();{let h=/charset="?([^;"\s]*)"?/i.exec(a),d=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{On.add(`file:${e}`,c);let u=ni[e];delete ni[e];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onLoad&&f.onLoad(c)}}).catch(c=>{let u=ni[e];if(u===void 0)throw this.manager.itemError(e),c;delete ni[e];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Cr=new WeakMap,zr=class extends kn{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,o=On.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0);else{let h=Cr.get(o);h===void 0&&(h=[],Cr.set(o,h)),h.push({onLoad:t,onError:r})}return o}let a=Dr("img");function l(){u(),t&&t(this);let h=Cr.get(this)||[];for(let d=0;d<h.length;d++){let f=h[d];f.onLoad&&f.onLoad(this)}Cr.delete(this),s.manager.itemEnd(e)}function c(h){u(),r&&r(h),On.remove(`image:${e}`);let d=Cr.get(this)||[];for(let f=0;f<d.length;f++){let g=d[f];g.onError&&g.onError(h)}Cr.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),On.add(`image:${e}`,a),s.manager.itemStart(e),a.src=e,a}};var js=class extends kn{constructor(e){super(e)}load(e,t,n,r){let s=new wt,o=new zr(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},n,r),s}},Zi=class extends $e{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new he(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Zs=class extends Zi{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy($e.DEFAULT_UP),this.updateMatrix(),this.groundColor=new he(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},mc=new Me,rd=new S,sd=new S,$s=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Le(512,512),this.mapType=ln,this.map=null,this.mapPass=null,this.matrix=new Me,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new kr,this._frameExtents=new Le(1,1),this._viewportCount=1,this._viewports=[new et(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;rd.setFromMatrixPosition(e.matrixWorld),t.position.copy(rd),sd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(sd),t.updateMatrixWorld(),mc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(mc,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(mc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ec=class extends $s{constructor(){super(new Rt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=qi*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||r!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=r,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},Js=class extends Zi{constructor(e,t,n=0,r=Math.PI/3,s=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy($e.DEFAULT_UP),this.updateMatrix(),this.target=new $e,this.distance=n,this.angle=r,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new Ec}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},od=new Me,ws=new S,gc=new S,bc=class extends $s{constructor(){super(new Rt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Le(4,2),this._viewportCount=6,this._viewports=[new et(2,1,1,1),new et(0,1,1,1),new et(3,1,1,1),new et(1,1,1,1),new et(3,0,1,1),new et(1,0,1,1)],this._cubeDirections=[new S(1,0,0),new S(-1,0,0),new S(0,0,1),new S(0,0,-1),new S(0,1,0),new S(0,-1,0)],this._cubeUps=[new S(0,1,0),new S(0,1,0),new S(0,1,0),new S(0,1,0),new S(0,0,1),new S(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,r=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),ws.setFromMatrixPosition(e.matrixWorld),n.position.copy(ws),gc.copy(n.position),gc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(gc),n.updateMatrixWorld(),r.makeTranslation(-ws.x,-ws.y,-ws.z),od.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(od,n.coordinateSystem,n.reversedDepth)}},Ks=class extends Zi{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new bc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},$i=class extends Os{constructor(e=-1,t=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=n-e,o=n+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Sc=class extends $s{constructor(){super(new $i(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ji=class extends Zi{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy($e.DEFAULT_UP),this.updateMatrix(),this.target=new $e,this.shadow=new Sc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var di=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var _c=new WeakMap,Qs=class extends kn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,o=On.get(`image-bitmap:${e}`);if(o!==void 0){if(s.manager.itemStart(e),o.then){o.then(c=>{if(_c.has(o)===!0)r&&r(_c.get(o)),s.manager.itemError(e),s.manager.itemEnd(e);else return t&&t(c),s.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){return On.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){r&&r(c),_c.set(l,c),On.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});On.add(`image-bitmap:${e}`,l),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var ga=class extends Rt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},eo=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};var _a=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let r,s,o;switch(t){case"quaternion":r=this._slerp,s=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":r=this._select,s=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:r=this._lerp,s=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=r,this._mixBufferRegionAdditive=s,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,r=this.valueSize,s=e*r+r,o=this.cumulativeWeight;if(o===0){for(let a=0;a!==r;++a)n[s+a]=n[a];o=t}else{o+=t;let a=t/o;this._mixBufferRegion(n,s,0,a,r)}this.cumulativeWeight=o}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,r=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,r,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,r=e*t+t,s=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){let l=t*this._origIndex;this._mixBufferRegion(n,r,l,1-s,t)}o>0&&this._mixBufferRegionAdditive(n,r,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){a.setValue(n,r);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,r=n*this._origIndex;e.getValue(t,r);for(let s=n,o=r;s!==o;++s)t[s]=t[r+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,r,s){if(r>=.5)for(let o=0;o!==s;++o)e[t+o]=e[n+o]}_slerp(e,t,n,r){ie.slerpFlat(e,t,e,t,e,n,r)}_slerpAdditive(e,t,n,r,s){let o=this._workIndex*s;ie.multiplyQuaternionsFlat(e,o,e,t,e,n),ie.slerpFlat(e,t,e,t,e,o,r)}_lerp(e,t,n,r,s){let o=1-r;for(let a=0;a!==s;++a){let l=t+a;e[l]=e[l]*o+e[n+a]*r}}_lerpAdditive(e,t,n,r,s){for(let o=0;o!==s;++o){let a=t+o;e[a]=e[a]+e[n+o]*r}}},Yc="\\[\\]\\.:\\/",Vg=new RegExp("["+Yc+"]","g"),jc="[^"+Yc+"]",zg="[^"+Yc.replace("\\.","")+"]",Gg=/((?:WC+[\/:])*)/.source.replace("WC",jc),Wg=/(WCOD+)?/.source.replace("WCOD",zg),Xg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",jc),qg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",jc),Yg=new RegExp("^"+Gg+Wg+Xg+qg+"$"),jg=["material","materials","bones","map"],Tc=class{constructor(e,t,n){let r=n||lt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=n.length;r!==s;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},lt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Vg,"")}static parseTrackName(e){let t=Yg.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=n.nodeName.substring(r+1);jg.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[r];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};lt.Composite=Tc;lt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};lt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};lt.prototype.GetterByBindingType=[lt.prototype._getValue_direct,lt.prototype._getValue_array,lt.prototype._getValue_arrayElement,lt.prototype._getValue_toArray];lt.prototype.SetterByBindingTypeAndVersioning=[[lt.prototype._setValue_direct,lt.prototype._setValue_direct_setNeedsUpdate,lt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_array,lt.prototype._setValue_array_setNeedsUpdate,lt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_arrayElement,lt.prototype._setValue_arrayElement_setNeedsUpdate,lt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_fromArray,lt.prototype._setValue_fromArray_setNeedsUpdate,lt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var va=class{constructor(e,t,n=null,r=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=r;let s=t.tracks,o=s.length,a=new Array(o),l={endingStart:Hi,endingEnd:Hi};for(let c=0;c!==o;++c){let u=s[c].createInterpolant(null);a[c]=u,u.settings=l}this._interpolantSettings=l,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=hl,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let r=this._clip.duration,s=e._clip.duration,o=s/r,a=r/s;e.warp(1,o,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let r=this._mixer,s=r.time,o=this.timeScale,a=this._timeScaleInterpolant;a===null&&(a=r._lendControlInterpolant(),this._timeScaleInterpolant=a);let l=a.parameterPositions,c=a.sampleValues;return l[0]=s,l[1]=s+n,c[0]=e/o,c[1]=t/o,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,r){if(!this.enabled){this._updateWeight(e);return}let s=this._startTime;if(s!==null){let l=(e-s)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);let o=this._updateTime(t),a=this._updateWeight(e);if(a>0){let l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case kd:for(let u=0,h=l.length;u!==h;++u)l[u].evaluate(o),c[u].accumulateAdditive(a);break;case dl:default:for(let u=0,h=l.length;u!==h;++u)l[u].evaluate(o),c[u].accumulate(r,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let r=n.evaluate(e)[0];t*=r,e>n.parameterPositions[1]&&(this.stopFading(),r===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let r=n.evaluate(e)[0];t*=r,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,r=this.time+e,s=this._loopCount,o=n===Bd;if(e===0)return s===-1?r:o&&(s&1)===1?t-r:r;if(n===ul){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(r>=t)r=t;else if(r<0)r=0;else{this.time=r;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=r,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),r>=t||r<0){let a=Math.floor(r/t);r-=t*a,s+=Math.abs(a);let l=this.repetitions-s;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,r=e>0?t:0,this.time=r,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){let c=e<0;this._setEndings(c,!c,o)}else this._setEndings(!1,!1,o);this._loopCount=s,this.time=r,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=r;if(o&&(s&1)===1)return t-r}return r}_setEndings(e,t,n){let r=this._interpolantSettings;n?(r.endingStart=Vi,r.endingEnd=Vi):(e?r.endingStart=this.zeroSlopeAtStart?Vi:Hi:r.endingStart=Cs,t?r.endingEnd=this.zeroSlopeAtEnd?Vi:Hi:r.endingEnd=Cs)}_scheduleFading(e,t,n){let r=this._mixer,s=r.time,o=this._weightInterpolant;o===null&&(o=r._lendControlInterpolant(),this._weightInterpolant=o);let a=o.parameterPositions,l=o.sampleValues;return a[0]=s,l[0]=t,a[1]=s+e,l[1]=n,this}},Zg=new Float32Array(1),to=class extends Fn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){let n=e._localRoot||this._root,r=e._clip.tracks,s=r.length,o=e._propertyBindings,a=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName,u=c[l];u===void 0&&(u={},c[l]=u);for(let h=0;h!==s;++h){let d=r[h],f=d.name,g=u[f];if(g!==void 0)++g.referenceCount,o[h]=g;else{if(g=o[h],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,l,f));continue}let _=t&&t._propertyBindings[h].binding.parsedPath;g=new _a(lt.create(n,f,_),d.ValueTypeName,d.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,l,f),o[h]=g}a[h].resultBuffer=g.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,r=e._clip.uuid,s=this._actionsByClip[r];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,r,n)}let t=e._propertyBindings;for(let n=0,r=t.length;n!==r;++n){let s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,r=t.length;n!==r;++n){let s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let r=this._actions,s=this._actionsByClip,o=s[t];if(o===void 0)o={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=o;else{let a=o.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=r.length,r.push(e),o.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],r=e._cacheIndex;n._cacheIndex=r,t[r]=n,t.pop(),e._cacheIndex=null;let s=e._clip.uuid,o=this._actionsByClip,a=o[s],l=a.knownActions,c=l[l.length-1],u=e._byClipCacheIndex;c._byClipCacheIndex=u,l[u]=c,l.pop(),e._byClipCacheIndex=null;let h=a.actionByRoot,d=(e._localRoot||this._root).uuid;delete h[d],l.length===0&&delete o[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,r=t.length;n!==r;++n){let s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,r=this._nActiveActions++,s=t[r];e._cacheIndex=r,t[r]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,r=--this._nActiveActions,s=t[r];e._cacheIndex=r,t[r]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){let r=this._bindingsByRootAndName,s=this._bindings,o=r[t];o===void 0&&(o={},r[t]=o),o[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,r=n.rootNode.uuid,s=n.path,o=this._bindingsByRootAndName,a=o[r],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete a[s],Object.keys(a).length===0&&delete o[r]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,r=this._nActiveBindings++,s=t[r];e._cacheIndex=r,t[r]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,r=--this._nActiveBindings,s=t[r];e._cacheIndex=r,t[r]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new qs(new Float32Array(2),new Float32Array(2),1,Zg),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,r=--this._nActiveControlInterpolants,s=t[r];e.__cacheIndex=r,t[r]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){let r=t||this._root,s=r.uuid,o=typeof e=="string"?hi.findByName(r,e):e,a=o!==null?o.uuid:e,l=this._actionsByClip[a],c=null;if(n===void 0&&(o!==null?n=o.blendMode:n=dl),l!==void 0){let h=l.actionByRoot[s];if(h!==void 0&&h.blendMode===n)return h;c=l.knownActions[0],o===null&&(o=c._clip)}if(o===null)return null;let u=new va(this,o,t,n);return this._bindAction(u,c),this._addInactiveAction(u,a,s),u}existingAction(e,t){let n=t||this._root,r=n.uuid,s=typeof e=="string"?hi.findByName(n,e):e,o=s?s.uuid:e,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[r]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,r=this.time+=e,s=Math.sign(e),o=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(r,e,s,o);let a=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)a[c].apply(o);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,r=this._actionsByClip,s=r[n];if(s!==void 0){let o=s.knownActions;for(let a=0,l=o.length;a!==l;++a){let c=o[a];this._deactivateAction(c);let u=c._cacheIndex,h=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,h._cacheIndex=u,t[u]=h,t.pop(),this._removeInactiveBindingsForAction(c)}delete r[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let o in n){let a=n[o].actionByRoot,l=a[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}let r=this._bindingsByRootAndName,s=r[t];if(s!==void 0)for(let o in s){let a=s[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var fi=class{constructor(e,t,n,r,s,o=!1){this.isGLBufferAttribute=!0,this.name="",this.buffer=e,this.type=t,this.itemSize=n,this.elementSize=r,this.count=s,this.normalized=o,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}};var no=class extends gn{constructor(e=1){let t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],r=new tt;r.setAttribute("position",new Wt(t,3)),r.setAttribute("color",new Wt(n,3));let s=new qt({vertexColors:!0,toneMapped:!1});super(r,s),this.type="AxesHelper"}setColors(e,t,n){let r=new he,s=this.geometry.attributes.color.array;return r.set(e),r.toArray(s,0),r.toArray(s,3),r.set(t),r.toArray(s,6),r.toArray(s,9),r.set(n),r.toArray(s,12),r.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}};function Zc(i,e,t,n){let r=$g(n);switch(t){case Fc:return i*e;case La:return i*e/r.components*r.byteLength;case Da:return i*e/r.components*r.byteLength;case kc:return i*e*2/r.components*r.byteLength;case Na:return i*e*2/r.components*r.byteLength;case Bc:return i*e*3/r.components*r.byteLength;case jt:return i*e*4/r.components*r.byteLength;case Ua:return i*e*4/r.components*r.byteLength;case ro:case so:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case oo:case ao:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Fa:case ka:return Math.max(i,16)*Math.max(e,8)/4;case Oa:case Ba:return Math.max(i,8)*Math.max(e,8)/2;case Ha:case Va:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case za:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ga:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Wa:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Xa:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case qa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ya:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ja:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Za:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case $a:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ja:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ka:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Qa:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case el:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case tl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case nl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case il:case rl:case sl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ol:case al:return Math.ceil(i/4)*Math.ceil(e/4)*8;case ll:case cl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function $g(i){switch(i){case ln:case Dc:return{byteLength:1,components:1};case Wr:case Nc:case Xr:return{byteLength:2,components:1};case Pa:case Ia:return{byteLength:2,components:4};case Ai:case Ca:case yn:return{byteLength:4,components:1};case Uc:case Oc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Tf(){let i=null,e=!1,t=null,n=null;function r(s,o){t(s,o),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function Jg(i){let e=new WeakMap;function t(a,l){let c=a.array,u=a.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){let u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<h.length;f++){let g=h[d],_=h[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,h[d]=_)}h.length=d+1;for(let f=0,g=h.length;f<g;f++){let _=h[f];i.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var Kg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Qg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,e_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,t_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,n_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,i_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,r_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT )
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN )
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,s_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,o_=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,a_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,l_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,c_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,u_=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,h_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,d_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,f_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,p_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,m_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,g_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,__=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,v_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,y_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,x_=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,M_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,E_=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,b_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,S_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,T_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,w_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,A_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,R_="gl_FragColor = linearToOutputTexel( gl_FragColor );",C_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,P_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,I_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif

#endif`,L_=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,D_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,N_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,U_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,O_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,F_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,B_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,k_=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,H_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,V_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,z_=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,G_=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,W_=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,X_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,q_=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Y_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,j_=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Z_=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,$_=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,J_=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,K_=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Q_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ev=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,tv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,iv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,rv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,sv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ov=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,av=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,cv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,uv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,hv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,dv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fv=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,pv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,gv=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,_v=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,xv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Mv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ev=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,bv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Sv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Tv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,wv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Av=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Rv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Cv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Pv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Iv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Lv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Dv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;

		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Nv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Uv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ov=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Fv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Bv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,kv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Hv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Vv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,zv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Gv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Wv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Xv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,qv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Yv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Zv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,$v=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Jv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Kv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ey=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ty=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ny=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,iy=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,ry=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,sy=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,oy=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ay=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ly=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cy=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,uy=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,hy=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,dy=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fy=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,py=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,my=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,gy=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_y=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,vy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,yy=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xy=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,My=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Ey=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,by=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sy=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ty=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,wy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ay=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ry=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Cy=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Py=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,We={alphahash_fragment:Kg,alphahash_pars_fragment:Qg,alphamap_fragment:e_,alphamap_pars_fragment:t_,alphatest_fragment:n_,alphatest_pars_fragment:i_,aomap_fragment:r_,aomap_pars_fragment:s_,batching_pars_vertex:o_,batching_vertex:a_,begin_vertex:l_,beginnormal_vertex:c_,bsdfs:u_,iridescence_fragment:h_,bumpmap_pars_fragment:d_,clipping_planes_fragment:f_,clipping_planes_pars_fragment:p_,clipping_planes_pars_vertex:m_,clipping_planes_vertex:g_,color_fragment:__,color_pars_fragment:v_,color_pars_vertex:y_,color_vertex:x_,common:M_,cube_uv_reflection_fragment:E_,defaultnormal_vertex:b_,displacementmap_pars_vertex:S_,displacementmap_vertex:T_,emissivemap_fragment:w_,emissivemap_pars_fragment:A_,colorspace_fragment:R_,colorspace_pars_fragment:C_,envmap_fragment:P_,envmap_common_pars_fragment:I_,envmap_pars_fragment:L_,envmap_pars_vertex:D_,envmap_physical_pars_fragment:W_,envmap_vertex:N_,fog_vertex:U_,fog_pars_vertex:O_,fog_fragment:F_,fog_pars_fragment:B_,gradientmap_pars_fragment:k_,lightmap_pars_fragment:H_,lights_lambert_fragment:V_,lights_lambert_pars_fragment:z_,lights_pars_begin:G_,lights_toon_fragment:X_,lights_toon_pars_fragment:q_,lights_phong_fragment:Y_,lights_phong_pars_fragment:j_,lights_physical_fragment:Z_,lights_physical_pars_fragment:$_,lights_fragment_begin:J_,lights_fragment_maps:K_,lights_fragment_end:Q_,logdepthbuf_fragment:ev,logdepthbuf_pars_fragment:tv,logdepthbuf_pars_vertex:nv,logdepthbuf_vertex:iv,map_fragment:rv,map_pars_fragment:sv,map_particle_fragment:ov,map_particle_pars_fragment:av,metalnessmap_fragment:lv,metalnessmap_pars_fragment:cv,morphinstance_vertex:uv,morphcolor_vertex:hv,morphnormal_vertex:dv,morphtarget_pars_vertex:fv,morphtarget_vertex:pv,normal_fragment_begin:mv,normal_fragment_maps:gv,normal_pars_fragment:_v,normal_pars_vertex:vv,normal_vertex:yv,normalmap_pars_fragment:xv,clearcoat_normal_fragment_begin:Mv,clearcoat_normal_fragment_maps:Ev,clearcoat_pars_fragment:bv,iridescence_pars_fragment:Sv,opaque_fragment:Tv,packing:wv,premultiplied_alpha_fragment:Av,project_vertex:Rv,dithering_fragment:Cv,dithering_pars_fragment:Pv,roughnessmap_fragment:Iv,roughnessmap_pars_fragment:Lv,shadowmap_pars_fragment:Dv,shadowmap_pars_vertex:Nv,shadowmap_vertex:Uv,shadowmask_pars_fragment:Ov,skinbase_vertex:Fv,skinning_pars_vertex:Bv,skinning_vertex:kv,skinnormal_vertex:Hv,specularmap_fragment:Vv,specularmap_pars_fragment:zv,tonemapping_fragment:Gv,tonemapping_pars_fragment:Wv,transmission_fragment:Xv,transmission_pars_fragment:qv,uv_pars_fragment:Yv,uv_pars_vertex:jv,uv_vertex:Zv,worldpos_vertex:$v,background_vert:Jv,background_frag:Kv,backgroundCube_vert:Qv,backgroundCube_frag:ey,cube_vert:ty,cube_frag:ny,depth_vert:iy,depth_frag:ry,distanceRGBA_vert:sy,distanceRGBA_frag:oy,equirect_vert:ay,equirect_frag:ly,linedashed_vert:cy,linedashed_frag:uy,meshbasic_vert:hy,meshbasic_frag:dy,meshlambert_vert:fy,meshlambert_frag:py,meshmatcap_vert:my,meshmatcap_frag:gy,meshnormal_vert:_y,meshnormal_frag:vy,meshphong_vert:yy,meshphong_frag:xy,meshphysical_vert:My,meshphysical_frag:Ey,meshtoon_vert:by,meshtoon_frag:Sy,points_vert:Ty,points_frag:wy,shadow_vert:Ay,shadow_frag:Ry,sprite_vert:Cy,sprite_frag:Py},oe={common:{diffuse:{value:new he(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Re},alphaMap:{value:null},alphaMapTransform:{value:new Re},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Re}},envmap:{envMap:{value:null},envMapRotation:{value:new Re},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Re}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Re}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Re},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Re},normalScale:{value:new Le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Re},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Re}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Re}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Re}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new he(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new he(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Re},alphaTest:{value:0},uvTransform:{value:new Re}},sprite:{diffuse:{value:new he(16777215)},opacity:{value:1},center:{value:new Le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Re},alphaMap:{value:null},alphaMapTransform:{value:new Re},alphaTest:{value:0}}},Vn={basic:{uniforms:Vt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:We.meshbasic_vert,fragmentShader:We.meshbasic_frag},lambert:{uniforms:Vt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new he(0)}}]),vertexShader:We.meshlambert_vert,fragmentShader:We.meshlambert_frag},phong:{uniforms:Vt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new he(0)},specular:{value:new he(1118481)},shininess:{value:30}}]),vertexShader:We.meshphong_vert,fragmentShader:We.meshphong_frag},standard:{uniforms:Vt([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new he(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag},toon:{uniforms:Vt([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new he(0)}}]),vertexShader:We.meshtoon_vert,fragmentShader:We.meshtoon_frag},matcap:{uniforms:Vt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:We.meshmatcap_vert,fragmentShader:We.meshmatcap_frag},points:{uniforms:Vt([oe.points,oe.fog]),vertexShader:We.points_vert,fragmentShader:We.points_frag},dashed:{uniforms:Vt([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:We.linedashed_vert,fragmentShader:We.linedashed_frag},depth:{uniforms:Vt([oe.common,oe.displacementmap]),vertexShader:We.depth_vert,fragmentShader:We.depth_frag},normal:{uniforms:Vt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:We.meshnormal_vert,fragmentShader:We.meshnormal_frag},sprite:{uniforms:Vt([oe.sprite,oe.fog]),vertexShader:We.sprite_vert,fragmentShader:We.sprite_frag},background:{uniforms:{uvTransform:{value:new Re},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:We.background_vert,fragmentShader:We.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Re}},vertexShader:We.backgroundCube_vert,fragmentShader:We.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:We.cube_vert,fragmentShader:We.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:We.equirect_vert,fragmentShader:We.equirect_frag},distanceRGBA:{uniforms:Vt([oe.common,oe.displacementmap,{referencePosition:{value:new S},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:We.distanceRGBA_vert,fragmentShader:We.distanceRGBA_frag},shadow:{uniforms:Vt([oe.lights,oe.fog,{color:{value:new he(0)},opacity:{value:1}}]),vertexShader:We.shadow_vert,fragmentShader:We.shadow_frag}};Vn.physical={uniforms:Vt([Vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Re},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Re},clearcoatNormalScale:{value:new Le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Re},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Re},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Re},sheen:{value:0},sheenColor:{value:new he(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Re},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Re},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Re},transmissionSamplerSize:{value:new Le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Re},attenuationDistance:{value:0},attenuationColor:{value:new he(0)},specularColor:{value:new he(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Re},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Re},anisotropyVector:{value:new Le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Re}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag};var pl={r:0,b:0,g:0},nr=new xt,Iy=new Me;function Ly(i,e,t,n,r,s,o){let a=new he(0),l=s===!0?0:1,c,u,h=null,d=0,f=null;function g(b){let y=b.isScene===!0?b.background:null;return y&&y.isTexture&&(y=(b.backgroundBlurriness>0?t:e).get(y)),y}function _(b){let y=!1,A=g(b);A===null?p(a,l):A&&A.isColor&&(p(A,1),y=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(b,y){let A=g(y);A&&(A.isCubeTexture||A.mapping===io)?(u===void 0&&(u=new Mt(new Or(1,1,1),new on({name:"BackgroundCubeMaterial",uniforms:tr(Vn.backgroundCube.uniforms),vertexShader:Vn.backgroundCube.vertexShader,fragmentShader:Vn.backgroundCube.fragmentShader,side:Ot,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,C,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),nr.copy(y.backgroundRotation),nr.x*=-1,nr.y*=-1,nr.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(nr.y*=-1,nr.z*=-1),u.material.uniforms.envMap.value=A,u.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Iy.makeRotationFromEuler(nr)),u.material.toneMapped=Ze.getTransfer(A.colorSpace)!==ot,(h!==A||d!==A.version||f!==i.toneMapping)&&(u.material.needsUpdate=!0,h=A,d=A.version,f=i.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):A&&A.isTexture&&(c===void 0&&(c=new Mt(new Xs(2,2),new on({name:"BackgroundMaterial",uniforms:tr(Vn.background.uniforms),vertexShader:Vn.background.vertexShader,fragmentShader:Vn.background.fragmentShader,side:In,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=A,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Ze.getTransfer(A.colorSpace)!==ot,A.matrixAutoUpdate===!0&&A.updateMatrix(),c.material.uniforms.uvTransform.value.copy(A.matrix),(h!==A||d!==A.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,h=A,d=A.version,f=i.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function p(b,y){b.getRGB(pl,qc(i)),n.buffers.color.setClear(pl.r,pl.g,pl.b,y,o)}function T(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,y=1){a.set(b),l=y,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,p(a,l)},render:_,addToRenderList:m,dispose:T}}function Dy(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null),s=r,o=!1;function a(M,P,F,V,X){let j=!1,z=h(V,F,P);s!==z&&(s=z,c(s.object)),j=f(M,V,F,X),j&&g(M,V,F,X),X!==null&&e.update(X,i.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,y(M,P,F,V),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function u(M){return i.deleteVertexArray(M)}function h(M,P,F){let V=F.wireframe===!0,X=n[M.id];X===void 0&&(X={},n[M.id]=X);let j=X[P.id];j===void 0&&(j={},X[P.id]=j);let z=j[V];return z===void 0&&(z=d(l()),j[V]=z),z}function d(M){let P=[],F=[],V=[];for(let X=0;X<t;X++)P[X]=0,F[X]=0,V[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:F,attributeDivisors:V,object:M,attributes:{},index:null}}function f(M,P,F,V){let X=s.attributes,j=P.attributes,z=0,K=F.getAttributes();for(let H in K)if(K[H].location>=0){let re=X[H],Ae=j[H];if(Ae===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(Ae=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(Ae=M.instanceColor)),re===void 0||re.attribute!==Ae||Ae&&re.data!==Ae.data)return!0;z++}return s.attributesNum!==z||s.index!==V}function g(M,P,F,V){let X={},j=P.attributes,z=0,K=F.getAttributes();for(let H in K)if(K[H].location>=0){let re=j[H];re===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(re=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(re=M.instanceColor));let Ae={};Ae.attribute=re,re&&re.data&&(Ae.data=re.data),X[H]=Ae,z++}s.attributes=X,s.attributesNum=z,s.index=V}function _(){let M=s.newAttributes;for(let P=0,F=M.length;P<F;P++)M[P]=0}function m(M){p(M,0)}function p(M,P){let F=s.newAttributes,V=s.enabledAttributes,X=s.attributeDivisors;F[M]=1,V[M]===0&&(i.enableVertexAttribArray(M),V[M]=1),X[M]!==P&&(i.vertexAttribDivisor(M,P),X[M]=P)}function T(){let M=s.newAttributes,P=s.enabledAttributes;for(let F=0,V=P.length;F<V;F++)P[F]!==M[F]&&(i.disableVertexAttribArray(F),P[F]=0)}function b(M,P,F,V,X,j,z){z===!0?i.vertexAttribIPointer(M,P,F,X,j):i.vertexAttribPointer(M,P,F,V,X,j)}function y(M,P,F,V){_();let X=V.attributes,j=F.getAttributes(),z=P.defaultAttributeValues;for(let K in j){let H=j[K];if(H.location>=0){let ae=X[K];if(ae===void 0&&(K==="instanceMatrix"&&M.instanceMatrix&&(ae=M.instanceMatrix),K==="instanceColor"&&M.instanceColor&&(ae=M.instanceColor)),ae!==void 0){let re=ae.normalized,Ae=ae.itemSize,Ge=e.get(ae);if(Ge===void 0)continue;let rt=Ge.buffer,dt=Ge.type,Je=Ge.bytesPerElement,q=dt===i.INT||dt===i.UNSIGNED_INT||ae.gpuType===Ca;if(ae.isInterleavedBufferAttribute){let Z=ae.data,pe=Z.stride,Oe=ae.offset;if(Z.isInstancedInterleavedBuffer){for(let Te=0;Te<H.locationSize;Te++)p(H.location+Te,Z.meshPerAttribute);M.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let Te=0;Te<H.locationSize;Te++)m(H.location+Te);i.bindBuffer(i.ARRAY_BUFFER,rt);for(let Te=0;Te<H.locationSize;Te++)b(H.location+Te,Ae/H.locationSize,dt,re,pe*Je,(Oe+Ae/H.locationSize*Te)*Je,q)}else{if(ae.isInstancedBufferAttribute){for(let Z=0;Z<H.locationSize;Z++)p(H.location+Z,ae.meshPerAttribute);M.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Z=0;Z<H.locationSize;Z++)m(H.location+Z);i.bindBuffer(i.ARRAY_BUFFER,rt);for(let Z=0;Z<H.locationSize;Z++)b(H.location+Z,Ae/H.locationSize,dt,re,Ae*Je,Ae/H.locationSize*Z*Je,q)}}else if(z!==void 0){let re=z[K];if(re!==void 0)switch(re.length){case 2:i.vertexAttrib2fv(H.location,re);break;case 3:i.vertexAttrib3fv(H.location,re);break;case 4:i.vertexAttrib4fv(H.location,re);break;default:i.vertexAttrib1fv(H.location,re)}}}}T()}function A(){L();for(let M in n){let P=n[M];for(let F in P){let V=P[F];for(let X in V)u(V[X].object),delete V[X];delete P[F]}delete n[M]}}function w(M){if(n[M.id]===void 0)return;let P=n[M.id];for(let F in P){let V=P[F];for(let X in V)u(V[X].object),delete V[X];delete P[F]}delete n[M.id]}function C(M){for(let P in n){let F=n[P];if(F[M.id]===void 0)continue;let V=F[M.id];for(let X in V)u(V[X].object),delete V[X];delete F[M.id]}}function L(){E(),o=!0,s!==r&&(s=r,c(s.object))}function E(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:L,resetDefaultState:E,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:T}}function Ny(i,e,t){let n;function r(c){n=c}function s(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let f=0;for(let g=0;g<h;g++)f+=u[g];t.update(f,n,1)}function l(c,u,h,d){if(h===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],u[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_]*d[_];t.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Uy(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(C){return!(C!==jt&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let L=C===Xr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==ln&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==yn&&!L)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:T,maxVaryings:b,maxFragmentUniforms:y,vertexTextures:A,maxSamples:w}}function Oy(i){let e=this,t=null,n=0,r=!1,s=!1,o=new Nn,a=new Re,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let f=h.length!==0||d||n!==0||r;return r=d,n=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){let g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,p=i.get(h);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{let T=s?0:n,b=T*4,y=p.clippingState||null;l.value=y,y=u(g,d,b,f);for(let A=0;A!==b;++A)y[A]=t[A];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,d,f,g){let _=h!==null?h.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let p=f+_*4,T=d.matrixWorldInverse;a.getNormalMatrix(T),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,y=f;b!==_;++b,y+=4)o.copy(h[b]).applyMatrix4(T,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Fy(i){let e=new WeakMap;function t(o,a){return a===wa?o.mapping=Ki:a===Aa&&(o.mapping=Qi),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===wa||a===Aa)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new aa(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){let a=o.target;a.removeEventListener("dispose",r);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}var $r=4,tf=[.125,.215,.35,.446,.526,.582],sr=20,$c=new $i,nf=new he,Jc=null,Kc=0,Qc=0,eu=!1,rr=(1+Math.sqrt(5))/2,Zr=1/rr,rf=[new S(-rr,Zr,0),new S(rr,Zr,0),new S(-Zr,0,rr),new S(Zr,0,rr),new S(0,rr,-Zr),new S(0,rr,Zr),new S(-1,1,-1),new S(1,1,-1),new S(-1,1,1),new S(1,1,1)],By=new S,_l=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100,s={}){let{size:o=256,position:a=By}=s;Jc=this._renderer.getRenderTarget(),Kc=this._renderer.getActiveCubeFace(),Qc=this._renderer.getActiveMipmapLevel(),eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,r,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=af(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=of(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Jc,Kc,Qc),this._renderer.xr.enabled=eu,e.scissorTest=!1,ml(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ki||e.mapping===Qi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Jc=this._renderer.getRenderTarget(),Kc=this._renderer.getActiveCubeFace(),Qc=this._renderer.getActiveMipmapLevel(),eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Xt,minFilter:Xt,generateMipmaps:!1,type:Xr,format:jt,colorSpace:Ut,depthBuffer:!1},r=sf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=sf(e,t,n);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ky(s)),this._blurMaterial=Hy(s,e,t)}return r}_compileMaterial(e){let t=new Mt(this._lodPlanes[0],e);this._renderer.compile(t,$c)}_sceneToCubeUV(e,t,n,r,s){let l=new Rt(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(nf),h.toneMapping=mi,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null));let _=new Kt({name:"PMREM.Background",side:Ot,depthWrite:!1,depthTest:!1}),m=new Mt(new Or,_),p=!1,T=e.background;T?T.isColor&&(_.color.copy(T),e.background=null,p=!0):(_.color.copy(nf),p=!0);for(let b=0;b<6;b++){let y=b%3;y===0?(l.up.set(0,c[b],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[b],s.y,s.z)):y===1?(l.up.set(0,0,c[b]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[b],s.z)):(l.up.set(0,c[b],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[b]));let A=this._cubeSize;ml(r,y*A,b>2?A:0,A,A),h.setRenderTarget(r),p&&h.render(m,l),h.render(e,l)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=T}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===Ki||e.mapping===Qi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=af()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=of());let s=r?this._cubemapMaterial:this._equirectMaterial,o=new Mt(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;let l=this._cubeSize;ml(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,$c)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodPlanes.length;for(let s=1;s<r;s++){let o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=rf[(r-s-1)%rf.length];this._blur(e,s-1,s,o,a)}t.autoClear=n}_blur(e,t,n,r,s){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,r,"latitudinal",s),this._halfBlur(o,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,h=new Mt(this._lodPlanes[r],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*sr-1),_=s/g,m=isFinite(s)?1+Math.floor(u*_):sr;m>sr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${sr}`);let p=[],T=0;for(let C=0;C<sr;++C){let L=C/_,E=Math.exp(-L*L/2);p.push(E),C===0?T+=E:C<m&&(T+=2*E)}for(let C=0;C<p.length;C++)p[C]=p[C]/T;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:b}=this;d.dTheta.value=g,d.mipInt.value=b-n;let y=this._sizeLods[r],A=3*y*(r>b-$r?r-b+$r:0),w=4*(this._cubeSize-y);ml(t,A,w,3*y,2*y),l.setRenderTarget(t),l.render(h,$c)}};function ky(i){let e=[],t=[],n=[],r=i,s=i-$r+1+tf.length;for(let o=0;o<s;o++){let a=Math.pow(2,r);t.push(a);let l=1/a;o>i-$r?l=tf[o-i+$r-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,_=3,m=2,p=1,T=new Float32Array(_*g*f),b=new Float32Array(m*g*f),y=new Float32Array(p*g*f);for(let w=0;w<f;w++){let C=w%3*2/3-1,L=w>2?0:-1,E=[C,L,0,C+2/3,L,0,C+2/3,L+1,0,C,L,0,C+2/3,L+1,0,C,L+1,0];T.set(E,_*g*w),b.set(d,m*g*w);let M=[w,w,w,w,w,w];y.set(M,p*g*w)}let A=new tt;A.setAttribute("position",new Be(T,_)),A.setAttribute("uv",new Be(b,m)),A.setAttribute("faceIndex",new Be(y,p)),e.push(A),r>$r&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function sf(i,e,t){let n=new mn(i,e,t);return n.texture.mapping=io,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ml(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function Hy(i,e,t){let n=new Float32Array(sr),r=new S(0,1,0);return new on({name:"SphericalGaussianBlur",defines:{n:sr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:uu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:pi,depthTest:!1,depthWrite:!1})}function of(){return new on({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:uu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:pi,depthTest:!1,depthWrite:!1})}function af(){return new on({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:uu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:pi,depthTest:!1,depthWrite:!1})}function uu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Vy(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===wa||l===Aa,u=l===Ki||l===Qi;if(c||u){let h=e.get(a),d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new _l(i)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{let f=a.image;return c&&f&&f.height>0||u&&f&&r(f)?(t===null&&(t=new _l(i)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0,c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){let l=a.target;l.removeEventListener("dispose",s);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function zy(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let r=t(n);return r===null&&Nr("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Gy(i,e,t,n){let r={},s=new WeakMap;function o(h){let d=h.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete r[d.id];let f=s.get(d);f&&(e.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,t.memory.geometries++),d}function l(h){let d=h.attributes;for(let f in d)e.update(d[f],i.ARRAY_BUFFER)}function c(h){let d=[],f=h.index,g=h.attributes.position,_=0;if(f!==null){let T=f.array;_=f.version;for(let b=0,y=T.length;b<y;b+=3){let A=T[b+0],w=T[b+1],C=T[b+2];d.push(A,w,w,C,C,A)}}else if(g!==void 0){let T=g.array;_=g.version;for(let b=0,y=T.length/3-1;b<y;b+=3){let A=b+0,w=b+1,C=b+2;d.push(A,w,w,C,C,A)}}else return;let m=new(Xc(d)?Us:Ns)(d,1);m.version=_;let p=s.get(h);p&&e.remove(p),s.set(h,m)}function u(h){let d=s.get(h);if(d){let f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function Wy(i,e,t){let n;function r(d){n=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,f){i.drawElements(n,f,s,d*o),t.update(f,n,1)}function c(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,s,d*o,g),t.update(f,n,g))}function u(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function h(d,f,g,_){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,s,d,0,_,0,g);let p=0;for(let T=0;T<g;T++)p+=f[T]*_[T];t.update(p,n,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Xy(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(s/3);break;case i.LINES:t.lines+=a*(s/2);break;case i.LINE_STRIP:t.lines+=a*(s-1);break;case i.LINE_LOOP:t.lines+=a*s;break;case i.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function qy(i,e,t){let n=new WeakMap,r=new et;function s(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0,d=n.get(a);if(d===void 0||d.count!==h){let E=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",E)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],T=a.morphAttributes.color||[],b=0;f===!0&&(b=1),g===!0&&(b=2),_===!0&&(b=3);let y=a.attributes.position.count*b,A=1;y>e.maxTextureSize&&(A=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let w=new Float32Array(y*A*4*h),C=new Ls(w,y,A,h);C.type=yn,C.needsUpdate=!0;let L=b*4;for(let M=0;M<h;M++){let P=m[M],F=p[M],V=T[M],X=y*A*4*M;for(let j=0;j<P.count;j++){let z=j*L;f===!0&&(r.fromBufferAttribute(P,j),w[X+z+0]=r.x,w[X+z+1]=r.y,w[X+z+2]=r.z,w[X+z+3]=0),g===!0&&(r.fromBufferAttribute(F,j),w[X+z+4]=r.x,w[X+z+5]=r.y,w[X+z+6]=r.z,w[X+z+7]=0),_===!0&&(r.fromBufferAttribute(V,j),w[X+z+8]=r.x,w[X+z+9]=r.y,w[X+z+10]=r.z,w[X+z+11]=V.itemSize===4?r.w:1)}}d={count:h,texture:C,size:new Le(y,A)},n.set(a,d),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function Yy(i,e,t,n){let r=new WeakMap;function s(l){let c=n.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return h}function o(){r=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}var wf=new wt,lf=new Gs(1,1),Af=new Ls,Rf=new sa,Cf=new Fs,cf=[],uf=[],hf=new Float32Array(16),df=new Float32Array(9),ff=new Float32Array(4);function Qr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let r=e*t,s=cf[r];if(s===void 0&&(s=new Float32Array(r),cf[r]=s),e!==0){n.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(s,a)}return s}function Pt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function It(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function yl(i,e){let t=uf[e];t===void 0&&(t=new Int32Array(e),uf[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function jy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Zy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;i.uniform2fv(this.addr,e),It(t,e)}}function $y(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Pt(t,e))return;i.uniform3fv(this.addr,e),It(t,e)}}function Jy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;i.uniform4fv(this.addr,e),It(t,e)}}function Ky(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),It(t,e)}else{if(Pt(t,n))return;ff.set(n),i.uniformMatrix2fv(this.addr,!1,ff),It(t,n)}}function Qy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),It(t,e)}else{if(Pt(t,n))return;df.set(n),i.uniformMatrix3fv(this.addr,!1,df),It(t,n)}}function ex(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),It(t,e)}else{if(Pt(t,n))return;hf.set(n),i.uniformMatrix4fv(this.addr,!1,hf),It(t,n)}}function tx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function nx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;i.uniform2iv(this.addr,e),It(t,e)}}function ix(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;i.uniform3iv(this.addr,e),It(t,e)}}function rx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;i.uniform4iv(this.addr,e),It(t,e)}}function sx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function ox(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;i.uniform2uiv(this.addr,e),It(t,e)}}function ax(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;i.uniform3uiv(this.addr,e),It(t,e)}}function lx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;i.uniform4uiv(this.addr,e),It(t,e)}}function cx(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(lf.compareFunction=Vc,s=lf):s=wf,t.setTexture2D(e||s,r)}function ux(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Rf,r)}function hx(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Cf,r)}function dx(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||Af,r)}function fx(i){switch(i){case 5126:return jy;case 35664:return Zy;case 35665:return $y;case 35666:return Jy;case 35674:return Ky;case 35675:return Qy;case 35676:return ex;case 5124:case 35670:return tx;case 35667:case 35671:return nx;case 35668:case 35672:return ix;case 35669:case 35673:return rx;case 5125:return sx;case 36294:return ox;case 36295:return ax;case 36296:return lx;case 35678:case 36198:case 36298:case 36306:case 35682:return cx;case 35679:case 36299:case 36307:return ux;case 35680:case 36300:case 36308:case 36293:return hx;case 36289:case 36303:case 36311:case 36292:return dx}}function px(i,e){i.uniform1fv(this.addr,e)}function mx(i,e){let t=Qr(e,this.size,2);i.uniform2fv(this.addr,t)}function gx(i,e){let t=Qr(e,this.size,3);i.uniform3fv(this.addr,t)}function _x(i,e){let t=Qr(e,this.size,4);i.uniform4fv(this.addr,t)}function vx(i,e){let t=Qr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function yx(i,e){let t=Qr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function xx(i,e){let t=Qr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Mx(i,e){i.uniform1iv(this.addr,e)}function Ex(i,e){i.uniform2iv(this.addr,e)}function bx(i,e){i.uniform3iv(this.addr,e)}function Sx(i,e){i.uniform4iv(this.addr,e)}function Tx(i,e){i.uniform1uiv(this.addr,e)}function wx(i,e){i.uniform2uiv(this.addr,e)}function Ax(i,e){i.uniform3uiv(this.addr,e)}function Rx(i,e){i.uniform4uiv(this.addr,e)}function Cx(i,e,t){let n=this.cache,r=e.length,s=yl(t,r);Pt(n,s)||(i.uniform1iv(this.addr,s),It(n,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||wf,s[o])}function Px(i,e,t){let n=this.cache,r=e.length,s=yl(t,r);Pt(n,s)||(i.uniform1iv(this.addr,s),It(n,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Rf,s[o])}function Ix(i,e,t){let n=this.cache,r=e.length,s=yl(t,r);Pt(n,s)||(i.uniform1iv(this.addr,s),It(n,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Cf,s[o])}function Lx(i,e,t){let n=this.cache,r=e.length,s=yl(t,r);Pt(n,s)||(i.uniform1iv(this.addr,s),It(n,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Af,s[o])}function Dx(i){switch(i){case 5126:return px;case 35664:return mx;case 35665:return gx;case 35666:return _x;case 35674:return vx;case 35675:return yx;case 35676:return xx;case 5124:case 35670:return Mx;case 35667:case 35671:return Ex;case 35668:case 35672:return bx;case 35669:case 35673:return Sx;case 5125:return Tx;case 36294:return wx;case 36295:return Ax;case 36296:return Rx;case 35678:case 36198:case 36298:case 36306:case 35682:return Cx;case 35679:case 36299:case 36307:return Px;case 35680:case 36300:case 36308:case 36293:return Ix;case 36289:case 36303:case 36311:case 36292:return Lx}}var nu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=fx(t.type)}},iu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Dx(t.type)}},ru=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,t[a.id],n)}}},tu=/(\w+)(\])?(\[|\.)?/g;function pf(i,e){i.seq.push(e),i.map[e.id]=e}function Nx(i,e,t){let n=i.name,r=n.length;for(tu.lastIndex=0;;){let s=tu.exec(n),o=tu.lastIndex,a=s[1],l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){pf(t,c===void 0?new nu(a,i,e):new iu(a,i,e));break}else{let h=t.map[a];h===void 0&&(h=new ru(a),pf(t,h)),t=h}}}var Jr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);Nx(s,o,this)}}setValue(e,t,n,r){let s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,o=t.length;s!==o;++s){let a=t[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in t&&n.push(o)}return n}};function mf(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Ux=37297,Ox=0;function Fx(i,e){let t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var gf=new Re;function Bx(i){Ze._getMatrix(gf,Ze.workingColorSpace,i);let e=`mat3( ${gf.elements.map(t=>t.toFixed(4))} )`;switch(Ze.getTransfer(i)){case Ps:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function _f(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=(i.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+Fx(i.getShaderSource(e),a)}else return s}function kx(i,e){let t=Bx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Hx(i,e){let t;switch(e){case Pd:t="Linear";break;case Id:t="Reinhard";break;case Ld:t="Cineon";break;case Dd:t="ACESFilmic";break;case Ud:t="AgX";break;case Od:t="Neutral";break;case Nd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var gl=new S;function Vx(){Ze.getLuminanceCoefficients(gl);let i=gl.x.toFixed(4),e=gl.y.toFixed(4),t=gl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function zx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(uo).join(`
`)}function Gx(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Wx(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){let s=i.getActiveAttrib(e,r),o=s.name,a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function uo(i){return i!==""}function vf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function yf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Xx=/^[ \t]*#include +<([\w\d./]+)>/gm;function su(i){return i.replace(Xx,Yx)}var qx=new Map;function Yx(i,e){let t=We[e];if(t===void 0){let n=qx.get(e);if(n!==void 0)t=We[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return su(t)}var jx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function xf(i){return i.replace(jx,Zx)}function Zx(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Mf(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function $x(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ac?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===cd?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Hn&&(e="SHADOWMAP_TYPE_VSM"),e}function Jx(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ki:case Qi:e="ENVMAP_TYPE_CUBE";break;case io:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Kx(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Qi&&(e="ENVMAP_MODE_REFRACTION"),e}function Qx(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ic:e="ENVMAP_BLENDING_MULTIPLY";break;case Rd:e="ENVMAP_BLENDING_MIX";break;case Cd:e="ENVMAP_BLENDING_ADD";break}return e}function e0(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function t0(i,e,t,n){let r=i.getContext(),s=t.defines,o=t.vertexShader,a=t.fragmentShader,l=$x(t),c=Jx(t),u=Kx(t),h=Qx(t),d=e0(t),f=zx(t),g=Gx(s),_=r.createProgram(),m,p,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(uo).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(uo).join(`
`),p.length>0&&(p+=`
`)):(m=[Mf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(uo).join(`
`),p=[Mf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==mi?"#define TONE_MAPPING":"",t.toneMapping!==mi?We.tonemapping_pars_fragment:"",t.toneMapping!==mi?Hx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",We.colorspace_pars_fragment,kx("linearToOutputTexel",t.outputColorSpace),Vx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(uo).join(`
`)),o=su(o),o=vf(o,t),o=yf(o,t),a=su(a),a=vf(a,t),a=yf(a,t),o=xf(o),a=xf(a),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Gc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Gc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let b=T+m+o,y=T+p+a,A=mf(r,r.VERTEX_SHADER,b),w=mf(r,r.FRAGMENT_SHADER,y);r.attachShader(_,A),r.attachShader(_,w),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function C(P){if(i.debug.checkShaderErrors){let F=r.getProgramInfoLog(_)||"",V=r.getShaderInfoLog(A)||"",X=r.getShaderInfoLog(w)||"",j=F.trim(),z=V.trim(),K=X.trim(),H=!0,ae=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,_,A,w);else{let re=_f(r,A,"vertex"),Ae=_f(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+j+`
`+re+`
`+Ae)}else j!==""?console.warn("THREE.WebGLProgram: Program Info Log:",j):(z===""||K==="")&&(ae=!1);ae&&(P.diagnostics={runnable:H,programLog:j,vertexShader:{log:z,prefix:m},fragmentShader:{log:K,prefix:p}})}r.deleteShader(A),r.deleteShader(w),L=new Jr(r,_),E=Wx(r,_)}let L;this.getUniforms=function(){return L===void 0&&C(this),L};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(_,Ux)),M},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ox++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=w,this}var n0=0,ou=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new au(e),t.set(e,n)),n}},au=class{constructor(e){this.id=n0++,this.code=e,this.usedTimes=0}};function i0(i,e,t,n,r,s,o){let a=new Ds,l=new ou,c=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures,f=r.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return c.add(E),E===0?"uv":`uv${E}`}function m(E,M,P,F,V){let X=F.fog,j=V.geometry,z=E.isMeshStandardMaterial?F.environment:null,K=(E.isMeshStandardMaterial?t:e).get(E.envMap||z),H=K&&K.mapping===io?K.image.height:null,ae=g[E.type];E.precision!==null&&(f=r.getMaxPrecision(E.precision),f!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",f,"instead."));let re=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,Ae=re!==void 0?re.length:0,Ge=0;j.morphAttributes.position!==void 0&&(Ge=1),j.morphAttributes.normal!==void 0&&(Ge=2),j.morphAttributes.color!==void 0&&(Ge=3);let rt,dt,Je,q;if(ae){let Ke=Vn[ae];rt=Ke.vertexShader,dt=Ke.fragmentShader}else rt=E.vertexShader,dt=E.fragmentShader,l.update(E),Je=l.getVertexShaderID(E),q=l.getFragmentShaderID(E);let Z=i.getRenderTarget(),pe=i.state.buffers.depth.getReversed(),Oe=V.isInstancedMesh===!0,Te=V.isBatchedMesh===!0,Xe=!!E.map,Ct=!!E.matcap,I=!!K,ft=!!E.aoMap,ke=!!E.lightMap,De=!!E.bumpMap,ve=!!E.normalMap,pt=!!E.displacementMap,ye=!!E.emissiveMap,ze=!!E.metalnessMap,St=!!E.roughnessMap,Et=E.anisotropy>0,R=E.clearcoat>0,v=E.dispersion>0,O=E.iridescence>0,W=E.sheen>0,$=E.transmission>0,G=Et&&!!E.anisotropyMap,we=R&&!!E.clearcoatMap,Q=R&&!!E.clearcoatNormalMap,Ee=R&&!!E.clearcoatRoughnessMap,be=O&&!!E.iridescenceMap,ee=O&&!!E.iridescenceThicknessMap,ce=W&&!!E.sheenColorMap,Pe=W&&!!E.sheenRoughnessMap,Se=!!E.specularMap,le=!!E.specularColorMap,Ve=!!E.specularIntensityMap,D=$&&!!E.transmissionMap,te=$&&!!E.thicknessMap,se=!!E.gradientMap,de=!!E.alphaMap,J=E.alphaTest>0,Y=!!E.alphaHash,ge=!!E.extensions,He=mi;E.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(He=i.toneMapping);let it={shaderID:ae,shaderType:E.type,shaderName:E.name,vertexShader:rt,fragmentShader:dt,defines:E.defines,customVertexShaderID:Je,customFragmentShaderID:q,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:f,batching:Te,batchingColor:Te&&V._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&V.instanceColor!==null,instancingMorph:Oe&&V.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:Z===null?i.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Ut,alphaToCoverage:!!E.alphaToCoverage,map:Xe,matcap:Ct,envMap:I,envMapMode:I&&K.mapping,envMapCubeUVHeight:H,aoMap:ft,lightMap:ke,bumpMap:De,normalMap:ve,displacementMap:d&&pt,emissiveMap:ye,normalMapObjectSpace:ve&&E.normalMapType===zd,normalMapTangentSpace:ve&&E.normalMapType===co,metalnessMap:ze,roughnessMap:St,anisotropy:Et,anisotropyMap:G,clearcoat:R,clearcoatMap:we,clearcoatNormalMap:Q,clearcoatRoughnessMap:Ee,dispersion:v,iridescence:O,iridescenceMap:be,iridescenceThicknessMap:ee,sheen:W,sheenColorMap:ce,sheenRoughnessMap:Pe,specularMap:Se,specularColorMap:le,specularIntensityMap:Ve,transmission:$,transmissionMap:D,thicknessMap:te,gradientMap:se,opaque:E.transparent===!1&&E.blending===zi&&E.alphaToCoverage===!1,alphaMap:de,alphaTest:J,alphaHash:Y,combine:E.combine,mapUv:Xe&&_(E.map.channel),aoMapUv:ft&&_(E.aoMap.channel),lightMapUv:ke&&_(E.lightMap.channel),bumpMapUv:De&&_(E.bumpMap.channel),normalMapUv:ve&&_(E.normalMap.channel),displacementMapUv:pt&&_(E.displacementMap.channel),emissiveMapUv:ye&&_(E.emissiveMap.channel),metalnessMapUv:ze&&_(E.metalnessMap.channel),roughnessMapUv:St&&_(E.roughnessMap.channel),anisotropyMapUv:G&&_(E.anisotropyMap.channel),clearcoatMapUv:we&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:Q&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ee&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:ce&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:Pe&&_(E.sheenRoughnessMap.channel),specularMapUv:Se&&_(E.specularMap.channel),specularColorMapUv:le&&_(E.specularColorMap.channel),specularIntensityMapUv:Ve&&_(E.specularIntensityMap.channel),transmissionMapUv:D&&_(E.transmissionMap.channel),thicknessMapUv:te&&_(E.thicknessMap.channel),alphaMapUv:de&&_(E.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(ve||Et),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!j.attributes.uv&&(Xe||de),fog:!!X,useFog:E.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:E.flatShading===!0&&E.wireframe===!1,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:pe,skinning:V.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:Ae,morphTextureStride:Ge,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:He,decodeVideoTexture:Xe&&E.map.isVideoTexture===!0&&Ze.getTransfer(E.map.colorSpace)===ot,decodeVideoTextureEmissive:ye&&E.emissiveMap.isVideoTexture===!0&&Ze.getTransfer(E.emissiveMap.colorSpace)===ot,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===Yt,flipSided:E.side===Ot,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:ge&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ge&&E.extensions.multiDraw===!0||Te)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return it.vertexUv1s=c.has(1),it.vertexUv2s=c.has(2),it.vertexUv3s=c.has(3),c.clear(),it}function p(E){let M=[];if(E.shaderID?M.push(E.shaderID):(M.push(E.customVertexShaderID),M.push(E.customFragmentShaderID)),E.defines!==void 0)for(let P in E.defines)M.push(P),M.push(E.defines[P]);return E.isRawShaderMaterial===!1&&(T(M,E),b(M,E),M.push(i.outputColorSpace)),M.push(E.customProgramCacheKey),M.join()}function T(E,M){E.push(M.precision),E.push(M.outputColorSpace),E.push(M.envMapMode),E.push(M.envMapCubeUVHeight),E.push(M.mapUv),E.push(M.alphaMapUv),E.push(M.lightMapUv),E.push(M.aoMapUv),E.push(M.bumpMapUv),E.push(M.normalMapUv),E.push(M.displacementMapUv),E.push(M.emissiveMapUv),E.push(M.metalnessMapUv),E.push(M.roughnessMapUv),E.push(M.anisotropyMapUv),E.push(M.clearcoatMapUv),E.push(M.clearcoatNormalMapUv),E.push(M.clearcoatRoughnessMapUv),E.push(M.iridescenceMapUv),E.push(M.iridescenceThicknessMapUv),E.push(M.sheenColorMapUv),E.push(M.sheenRoughnessMapUv),E.push(M.specularMapUv),E.push(M.specularColorMapUv),E.push(M.specularIntensityMapUv),E.push(M.transmissionMapUv),E.push(M.thicknessMapUv),E.push(M.combine),E.push(M.fogExp2),E.push(M.sizeAttenuation),E.push(M.morphTargetsCount),E.push(M.morphAttributeCount),E.push(M.numDirLights),E.push(M.numPointLights),E.push(M.numSpotLights),E.push(M.numSpotLightMaps),E.push(M.numHemiLights),E.push(M.numRectAreaLights),E.push(M.numDirLightShadows),E.push(M.numPointLightShadows),E.push(M.numSpotLightShadows),E.push(M.numSpotLightShadowsWithMaps),E.push(M.numLightProbes),E.push(M.shadowMapType),E.push(M.toneMapping),E.push(M.numClippingPlanes),E.push(M.numClipIntersection),E.push(M.depthPacking)}function b(E,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),M.gradientMap&&a.enable(22),E.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),E.push(a.mask)}function y(E){let M=g[E.type],P;if(M){let F=Vn[M];P=fl.clone(F.uniforms)}else P=E.uniforms;return P}function A(E,M){let P;for(let F=0,V=u.length;F<V;F++){let X=u[F];if(X.cacheKey===M){P=X,++P.usedTimes;break}}return P===void 0&&(P=new t0(i,M,E,s),u.push(P)),P}function w(E){if(--E.usedTimes===0){let M=u.indexOf(E);u[M]=u[u.length-1],u.pop(),E.destroy()}}function C(E){l.remove(E)}function L(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:A,releaseProgram:w,releaseShaderCache:C,programs:u,dispose:L}}function r0(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function r(o,a,l){i.get(o)[a]=l}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function s0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Ef(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function bf(){let i=[],e=0,t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function o(h,d,f,g,_,m){let p=i[e];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},i[e]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=_,p.group=m),e++,p}function a(h,d,f,g,_,m){let p=o(h,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?r.push(p):t.push(p)}function l(h,d,f,g,_,m){let p=o(h,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?r.unshift(p):t.unshift(p)}function c(h,d){t.length>1&&t.sort(h||s0),n.length>1&&n.sort(d||Ef),r.length>1&&r.sort(d||Ef)}function u(){for(let h=e,d=i.length;h<d;h++){let f=i[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function o0(){let i=new WeakMap;function e(n,r){let s=i.get(n),o;return s===void 0?(o=new bf,i.set(n,[o])):r>=s.length?(o=new bf,s.push(o)):o=s[r],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function a0(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new S,color:new he};break;case"SpotLight":t={position:new S,direction:new S,color:new he,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new S,color:new he,distance:0,decay:0};break;case"HemisphereLight":t={direction:new S,skyColor:new he,groundColor:new he};break;case"RectAreaLight":t={color:new he,position:new S,halfWidth:new S,halfHeight:new S};break}return i[e.id]=t,t}}}function l0(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var c0=0;function u0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function h0(i){let e=new a0,t=l0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new S);let r=new S,s=new Me,o=new Me;function a(c){let u=0,h=0,d=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,T=0,b=0,y=0,A=0,w=0,C=0;c.sort(u0);for(let E=0,M=c.length;E<M;E++){let P=c[E],F=P.color,V=P.intensity,X=P.distance,j=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=F.r*V,h+=F.g*V,d+=F.b*V;else if(P.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(P.sh.coefficients[z],V);C++}else if(P.isDirectionalLight){let z=e.get(P);if(z.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let K=P.shadow,H=t.get(P);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,n.directionalShadow[f]=H,n.directionalShadowMap[f]=j,n.directionalShadowMatrix[f]=P.shadow.matrix,T++}n.directional[f]=z,f++}else if(P.isSpotLight){let z=e.get(P);z.position.setFromMatrixPosition(P.matrixWorld),z.color.copy(F).multiplyScalar(V),z.distance=X,z.coneCos=Math.cos(P.angle),z.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),z.decay=P.decay,n.spot[_]=z;let K=P.shadow;if(P.map&&(n.spotLightMap[A]=P.map,A++,K.updateMatrices(P),P.castShadow&&w++),n.spotLightMatrix[_]=K.matrix,P.castShadow){let H=t.get(P);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,n.spotShadow[_]=H,n.spotShadowMap[_]=j,y++}_++}else if(P.isRectAreaLight){let z=e.get(P);z.color.copy(F).multiplyScalar(V),z.halfWidth.set(P.width*.5,0,0),z.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=z,m++}else if(P.isPointLight){let z=e.get(P);if(z.color.copy(P.color).multiplyScalar(P.intensity),z.distance=P.distance,z.decay=P.decay,P.castShadow){let K=P.shadow,H=t.get(P);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,H.shadowCameraNear=K.camera.near,H.shadowCameraFar=K.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=j,n.pointShadowMatrix[g]=P.shadow.matrix,b++}n.point[g]=z,g++}else if(P.isHemisphereLight){let z=e.get(P);z.skyColor.copy(P.color).multiplyScalar(V),z.groundColor.copy(P.groundColor).multiplyScalar(V),n.hemi[p]=z,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=oe.LTC_FLOAT_1,n.rectAreaLTC2=oe.LTC_FLOAT_2):(n.rectAreaLTC1=oe.LTC_HALF_1,n.rectAreaLTC2=oe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;let L=n.hash;(L.directionalLength!==f||L.pointLength!==g||L.spotLength!==_||L.rectAreaLength!==m||L.hemiLength!==p||L.numDirectionalShadows!==T||L.numPointShadows!==b||L.numSpotShadows!==y||L.numSpotMaps!==A||L.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=y+A-w,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=C,L.directionalLength=f,L.pointLength=g,L.spotLength=_,L.rectAreaLength=m,L.hemiLength=p,L.numDirectionalShadows=T,L.numPointShadows=b,L.numSpotShadows=y,L.numSpotMaps=A,L.numLightProbes=C,n.version=c0++)}function l(c,u){let h=0,d=0,f=0,g=0,_=0,m=u.matrixWorldInverse;for(let p=0,T=c.length;p<T;p++){let b=c[p];if(b.isDirectionalLight){let y=n.directional[h];y.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),h++}else if(b.isSpotLight){let y=n.spot[f];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),f++}else if(b.isRectAreaLight){let y=n.rectArea[g];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),o.identity(),s.copy(b.matrixWorld),s.premultiply(m),o.extractRotation(s),y.halfWidth.set(b.width*.5,0,0),y.halfHeight.set(0,b.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(b.isPointLight){let y=n.point[d];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),d++}else if(b.isHemisphereLight){let y=n.hemi[_];y.direction.setFromMatrixPosition(b.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function Sf(i){let e=new h0(i),t=[],n=[];function r(u){c.camera=u,t.length=0,n.length=0}function s(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function d0(i){let e=new WeakMap;function t(r,s=0){let o=e.get(r),a;return o===void 0?(a=new Sf(i),e.set(r,[a])):s>=o.length?(a=new Sf(i),o.push(a)):a=o[s],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var f0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,p0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function m0(i,e,t){let n=new kr,r=new Le,s=new Le,o=new et,a=new ua({depthPacking:Vd}),l=new ha,c={},u=t.maxTextureSize,h={[In]:Ot,[Ot]:In,[Yt]:Yt},d=new on({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Le},radius:{value:4}},vertexShader:f0,fragmentShader:p0}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new tt;g.setAttribute("position",new Be(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Mt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ac;let p=this.type;this.render=function(w,C,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;let E=i.getRenderTarget(),M=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),F=i.state;F.setBlending(pi),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let V=p!==Hn&&this.type===Hn,X=p===Hn&&this.type!==Hn;for(let j=0,z=w.length;j<z;j++){let K=w[j],H=K.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;r.copy(H.mapSize);let ae=H.getFrameExtents();if(r.multiply(ae),s.copy(H.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/ae.x),r.x=s.x*ae.x,H.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/ae.y),r.y=s.y*ae.y,H.mapSize.y=s.y)),H.map===null||V===!0||X===!0){let Ae=this.type!==Hn?{minFilter:Nt,magFilter:Nt}:{};H.map!==null&&H.map.dispose(),H.map=new mn(r.x,r.y,Ae),H.map.texture.name=K.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();let re=H.getViewportCount();for(let Ae=0;Ae<re;Ae++){let Ge=H.getViewport(Ae);o.set(s.x*Ge.x,s.y*Ge.y,s.x*Ge.z,s.y*Ge.w),F.viewport(o),H.updateMatrices(K,Ae),n=H.getFrustum(),y(C,L,H.camera,K,this.type)}H.isPointLightShadow!==!0&&this.type===Hn&&T(H,L),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(E,M,P)};function T(w,C){let L=e.update(_);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new mn(r.x,r.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(C,null,L,d,_,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(C,null,L,f,_,null)}function b(w,C,L,E){let M=null,P=L.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(P!==void 0)M=P;else if(M=L.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let F=M.uuid,V=C.uuid,X=c[F];X===void 0&&(X={},c[F]=X);let j=X[V];j===void 0&&(j=M.clone(),X[V]=j,C.addEventListener("dispose",A)),M=j}if(M.visible=C.visible,M.wireframe=C.wireframe,E===Hn?M.side=C.shadowSide!==null?C.shadowSide:C.side:M.side=C.shadowSide!==null?C.shadowSide:h[C.side],M.alphaMap=C.alphaMap,M.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,M.map=C.map,M.clipShadows=C.clipShadows,M.clippingPlanes=C.clippingPlanes,M.clipIntersection=C.clipIntersection,M.displacementMap=C.displacementMap,M.displacementScale=C.displacementScale,M.displacementBias=C.displacementBias,M.wireframeLinewidth=C.wireframeLinewidth,M.linewidth=C.linewidth,L.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let F=i.properties.get(M);F.light=L}return M}function y(w,C,L,E,M){if(w.visible===!1)return;if(w.layers.test(C.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===Hn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,w.matrixWorld);let V=e.update(w),X=w.material;if(Array.isArray(X)){let j=V.groups;for(let z=0,K=j.length;z<K;z++){let H=j[z],ae=X[H.materialIndex];if(ae&&ae.visible){let re=b(w,ae,E,M);w.onBeforeShadow(i,w,C,L,V,re,H),i.renderBufferDirect(L,null,V,re,w,H),w.onAfterShadow(i,w,C,L,V,re,H)}}}else if(X.visible){let j=b(w,X,E,M);w.onBeforeShadow(i,w,C,L,V,j,null),i.renderBufferDirect(L,null,V,j,w,null),w.onAfterShadow(i,w,C,L,V,j,null)}}let F=w.children;for(let V=0,X=F.length;V<X;V++)y(F[V],C,L,E,M)}function A(w){w.target.removeEventListener("dispose",A);for(let L in c){let E=c[L],M=w.target.uuid;M in E&&(E[M].dispose(),delete E[M])}}}var g0={[ya]:xa,[Ma]:Sa,[Ea]:Ta,[Gi]:ba,[xa]:ya,[Sa]:Ma,[Ta]:Ea,[ba]:Gi};function _0(i,e){function t(){let D=!1,te=new et,se=null,de=new et(0,0,0,0);return{setMask:function(J){se!==J&&!D&&(i.colorMask(J,J,J,J),se=J)},setLocked:function(J){D=J},setClear:function(J,Y,ge,He,it){it===!0&&(J*=He,Y*=He,ge*=He),te.set(J,Y,ge,He),de.equals(te)===!1&&(i.clearColor(J,Y,ge,He),de.copy(te))},reset:function(){D=!1,se=null,de.set(-1,0,0,0)}}}function n(){let D=!1,te=!1,se=null,de=null,J=null;return{setReversed:function(Y){if(te!==Y){let ge=e.get("EXT_clip_control");Y?ge.clipControlEXT(ge.LOWER_LEFT_EXT,ge.ZERO_TO_ONE_EXT):ge.clipControlEXT(ge.LOWER_LEFT_EXT,ge.NEGATIVE_ONE_TO_ONE_EXT),te=Y;let He=J;J=null,this.setClear(He)}},getReversed:function(){return te},setTest:function(Y){Y?Z(i.DEPTH_TEST):pe(i.DEPTH_TEST)},setMask:function(Y){se!==Y&&!D&&(i.depthMask(Y),se=Y)},setFunc:function(Y){if(te&&(Y=g0[Y]),de!==Y){switch(Y){case ya:i.depthFunc(i.NEVER);break;case xa:i.depthFunc(i.ALWAYS);break;case Ma:i.depthFunc(i.LESS);break;case Gi:i.depthFunc(i.LEQUAL);break;case Ea:i.depthFunc(i.EQUAL);break;case ba:i.depthFunc(i.GEQUAL);break;case Sa:i.depthFunc(i.GREATER);break;case Ta:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}de=Y}},setLocked:function(Y){D=Y},setClear:function(Y){J!==Y&&(te&&(Y=1-Y),i.clearDepth(Y),J=Y)},reset:function(){D=!1,se=null,de=null,J=null,te=!1}}}function r(){let D=!1,te=null,se=null,de=null,J=null,Y=null,ge=null,He=null,it=null;return{setTest:function(Ke){D||(Ke?Z(i.STENCIL_TEST):pe(i.STENCIL_TEST))},setMask:function(Ke){te!==Ke&&!D&&(i.stencilMask(Ke),te=Ke)},setFunc:function(Ke,Sn,hn){(se!==Ke||de!==Sn||J!==hn)&&(i.stencilFunc(Ke,Sn,hn),se=Ke,de=Sn,J=hn)},setOp:function(Ke,Sn,hn){(Y!==Ke||ge!==Sn||He!==hn)&&(i.stencilOp(Ke,Sn,hn),Y=Ke,ge=Sn,He=hn)},setLocked:function(Ke){D=Ke},setClear:function(Ke){it!==Ke&&(i.clearStencil(Ke),it=Ke)},reset:function(){D=!1,te=null,se=null,de=null,J=null,Y=null,ge=null,He=null,it=null}}}let s=new t,o=new n,a=new r,l=new WeakMap,c=new WeakMap,u={},h={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,T=null,b=null,y=null,A=null,w=null,C=new he(0,0,0),L=0,E=!1,M=null,P=null,F=null,V=null,X=null,j=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,K=0,H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(H)[1]),z=K>=1):H.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),z=K>=2);let ae=null,re={},Ae=i.getParameter(i.SCISSOR_BOX),Ge=i.getParameter(i.VIEWPORT),rt=new et().fromArray(Ae),dt=new et().fromArray(Ge);function Je(D,te,se,de){let J=new Uint8Array(4),Y=i.createTexture();i.bindTexture(D,Y),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ge=0;ge<se;ge++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(te,0,i.RGBA,1,1,de,0,i.RGBA,i.UNSIGNED_BYTE,J):i.texImage2D(te+ge,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,J);return Y}let q={};q[i.TEXTURE_2D]=Je(i.TEXTURE_2D,i.TEXTURE_2D,1),q[i.TEXTURE_CUBE_MAP]=Je(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[i.TEXTURE_2D_ARRAY]=Je(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),q[i.TEXTURE_3D]=Je(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Z(i.DEPTH_TEST),o.setFunc(Gi),De(!1),ve(wc),Z(i.CULL_FACE),ft(pi);function Z(D){u[D]!==!0&&(i.enable(D),u[D]=!0)}function pe(D){u[D]!==!1&&(i.disable(D),u[D]=!1)}function Oe(D,te){return h[D]!==te?(i.bindFramebuffer(D,te),h[D]=te,D===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=te),D===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=te),!0):!1}function Te(D,te){let se=f,de=!1;if(D){se=d.get(te),se===void 0&&(se=[],d.set(te,se));let J=D.textures;if(se.length!==J.length||se[0]!==i.COLOR_ATTACHMENT0){for(let Y=0,ge=J.length;Y<ge;Y++)se[Y]=i.COLOR_ATTACHMENT0+Y;se.length=J.length,de=!0}}else se[0]!==i.BACK&&(se[0]=i.BACK,de=!0);de&&i.drawBuffers(se)}function Xe(D){return g!==D?(i.useProgram(D),g=D,!0):!1}let Ct={[Si]:i.FUNC_ADD,[hd]:i.FUNC_SUBTRACT,[dd]:i.FUNC_REVERSE_SUBTRACT};Ct[fd]=i.MIN,Ct[pd]=i.MAX;let I={[md]:i.ZERO,[gd]:i.ONE,[_d]:i.SRC_COLOR,[ea]:i.SRC_ALPHA,[bd]:i.SRC_ALPHA_SATURATE,[Md]:i.DST_COLOR,[yd]:i.DST_ALPHA,[vd]:i.ONE_MINUS_SRC_COLOR,[ta]:i.ONE_MINUS_SRC_ALPHA,[Ed]:i.ONE_MINUS_DST_COLOR,[xd]:i.ONE_MINUS_DST_ALPHA,[Sd]:i.CONSTANT_COLOR,[Td]:i.ONE_MINUS_CONSTANT_COLOR,[wd]:i.CONSTANT_ALPHA,[Ad]:i.ONE_MINUS_CONSTANT_ALPHA};function ft(D,te,se,de,J,Y,ge,He,it,Ke){if(D===pi){_===!0&&(pe(i.BLEND),_=!1);return}if(_===!1&&(Z(i.BLEND),_=!0),D!==ud){if(D!==m||Ke!==E){if((p!==Si||y!==Si)&&(i.blendEquation(i.FUNC_ADD),p=Si,y=Si),Ke)switch(D){case zi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Rc:i.blendFunc(i.ONE,i.ONE);break;case Cc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Pc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case zi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Rc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Cc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Pc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}T=null,b=null,A=null,w=null,C.set(0,0,0),L=0,m=D,E=Ke}return}J=J||te,Y=Y||se,ge=ge||de,(te!==p||J!==y)&&(i.blendEquationSeparate(Ct[te],Ct[J]),p=te,y=J),(se!==T||de!==b||Y!==A||ge!==w)&&(i.blendFuncSeparate(I[se],I[de],I[Y],I[ge]),T=se,b=de,A=Y,w=ge),(He.equals(C)===!1||it!==L)&&(i.blendColor(He.r,He.g,He.b,it),C.copy(He),L=it),m=D,E=!1}function ke(D,te){D.side===Yt?pe(i.CULL_FACE):Z(i.CULL_FACE);let se=D.side===Ot;te&&(se=!se),De(se),D.blending===zi&&D.transparent===!1?ft(pi):ft(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),o.setFunc(D.depthFunc),o.setTest(D.depthTest),o.setMask(D.depthWrite),s.setMask(D.colorWrite);let de=D.stencilWrite;a.setTest(de),de&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),ye(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Z(i.SAMPLE_ALPHA_TO_COVERAGE):pe(i.SAMPLE_ALPHA_TO_COVERAGE)}function De(D){M!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),M=D)}function ve(D){D!==ad?(Z(i.CULL_FACE),D!==P&&(D===wc?i.cullFace(i.BACK):D===ld?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):pe(i.CULL_FACE),P=D}function pt(D){D!==F&&(z&&i.lineWidth(D),F=D)}function ye(D,te,se){D?(Z(i.POLYGON_OFFSET_FILL),(V!==te||X!==se)&&(i.polygonOffset(te,se),V=te,X=se)):pe(i.POLYGON_OFFSET_FILL)}function ze(D){D?Z(i.SCISSOR_TEST):pe(i.SCISSOR_TEST)}function St(D){D===void 0&&(D=i.TEXTURE0+j-1),ae!==D&&(i.activeTexture(D),ae=D)}function Et(D,te,se){se===void 0&&(ae===null?se=i.TEXTURE0+j-1:se=ae);let de=re[se];de===void 0&&(de={type:void 0,texture:void 0},re[se]=de),(de.type!==D||de.texture!==te)&&(ae!==se&&(i.activeTexture(se),ae=se),i.bindTexture(D,te||q[D]),de.type=D,de.texture=te)}function R(){let D=re[ae];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function v(){try{i.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function W(){try{i.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function $(){try{i.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function G(){try{i.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function we(){try{i.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Q(){try{i.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ee(){try{i.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function be(){try{i.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ee(){try{i.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ce(D){rt.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),rt.copy(D))}function Pe(D){dt.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),dt.copy(D))}function Se(D,te){let se=c.get(te);se===void 0&&(se=new WeakMap,c.set(te,se));let de=se.get(D);de===void 0&&(de=i.getUniformBlockIndex(te,D.name),se.set(D,de))}function le(D,te){let de=c.get(te).get(D);l.get(te)!==de&&(i.uniformBlockBinding(te,de,D.__bindingPointIndex),l.set(te,de))}function Ve(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},ae=null,re={},h={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,T=null,b=null,y=null,A=null,w=null,C=new he(0,0,0),L=0,E=!1,M=null,P=null,F=null,V=null,X=null,rt.set(0,0,i.canvas.width,i.canvas.height),dt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:Z,disable:pe,bindFramebuffer:Oe,drawBuffers:Te,useProgram:Xe,setBlending:ft,setMaterial:ke,setFlipSided:De,setCullFace:ve,setLineWidth:pt,setPolygonOffset:ye,setScissorTest:ze,activeTexture:St,bindTexture:Et,unbindTexture:R,compressedTexImage2D:v,compressedTexImage3D:O,texImage2D:be,texImage3D:ee,updateUBOMapping:Se,uniformBlockBinding:le,texStorage2D:Q,texStorage3D:Ee,texSubImage2D:W,texSubImage3D:$,compressedTexSubImage2D:G,compressedTexSubImage3D:we,scissor:ce,viewport:Pe,reset:Ve}}function v0(i,e,t,n,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Le,u=new WeakMap,h,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,v){return f?new OffscreenCanvas(R,v):Dr("canvas")}function _(R,v,O){let W=1,$=Et(R);if(($.width>O||$.height>O)&&(W=O/Math.max($.width,$.height)),W<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let G=Math.floor(W*$.width),we=Math.floor(W*$.height);h===void 0&&(h=g(G,we));let Q=v?g(G,we):h;return Q.width=G,Q.height=we,Q.getContext("2d").drawImage(R,0,0,G,we),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+G+"x"+we+")."),Q}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),R;return R}function m(R){return R.generateMipmaps}function p(R){i.generateMipmap(R)}function T(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(R,v,O,W,$=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let G=v;if(v===i.RED&&(O===i.FLOAT&&(G=i.R32F),O===i.HALF_FLOAT&&(G=i.R16F),O===i.UNSIGNED_BYTE&&(G=i.R8)),v===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.R8UI),O===i.UNSIGNED_SHORT&&(G=i.R16UI),O===i.UNSIGNED_INT&&(G=i.R32UI),O===i.BYTE&&(G=i.R8I),O===i.SHORT&&(G=i.R16I),O===i.INT&&(G=i.R32I)),v===i.RG&&(O===i.FLOAT&&(G=i.RG32F),O===i.HALF_FLOAT&&(G=i.RG16F),O===i.UNSIGNED_BYTE&&(G=i.RG8)),v===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RG8UI),O===i.UNSIGNED_SHORT&&(G=i.RG16UI),O===i.UNSIGNED_INT&&(G=i.RG32UI),O===i.BYTE&&(G=i.RG8I),O===i.SHORT&&(G=i.RG16I),O===i.INT&&(G=i.RG32I)),v===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RGB8UI),O===i.UNSIGNED_SHORT&&(G=i.RGB16UI),O===i.UNSIGNED_INT&&(G=i.RGB32UI),O===i.BYTE&&(G=i.RGB8I),O===i.SHORT&&(G=i.RGB16I),O===i.INT&&(G=i.RGB32I)),v===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(G=i.RGBA16UI),O===i.UNSIGNED_INT&&(G=i.RGBA32UI),O===i.BYTE&&(G=i.RGBA8I),O===i.SHORT&&(G=i.RGBA16I),O===i.INT&&(G=i.RGBA32I)),v===i.RGB&&(O===i.UNSIGNED_INT_5_9_9_9_REV&&(G=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(G=i.R11F_G11F_B10F)),v===i.RGBA){let we=$?Ps:Ze.getTransfer(W);O===i.FLOAT&&(G=i.RGBA32F),O===i.HALF_FLOAT&&(G=i.RGBA16F),O===i.UNSIGNED_BYTE&&(G=we===ot?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(G=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(G=i.RGB5_A1)}return(G===i.R16F||G===i.R32F||G===i.RG16F||G===i.RG32F||G===i.RGBA16F||G===i.RGBA32F)&&e.get("EXT_color_buffer_float"),G}function y(R,v){let O;return R?v===null||v===Ai||v===qr?O=i.DEPTH24_STENCIL8:v===yn?O=i.DEPTH32F_STENCIL8:v===Wr&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Ai||v===qr?O=i.DEPTH_COMPONENT24:v===yn?O=i.DEPTH_COMPONENT32F:v===Wr&&(O=i.DEPTH_COMPONENT16),O}function A(R,v){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Nt&&R.minFilter!==Xt?Math.log2(Math.max(v.width,v.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?v.mipmaps.length:1}function w(R){let v=R.target;v.removeEventListener("dispose",w),L(v),v.isVideoTexture&&u.delete(v)}function C(R){let v=R.target;v.removeEventListener("dispose",C),M(v)}function L(R){let v=n.get(R);if(v.__webglInit===void 0)return;let O=R.source,W=d.get(O);if(W){let $=W[v.__cacheKey];$.usedTimes--,$.usedTimes===0&&E(R),Object.keys(W).length===0&&d.delete(O)}n.remove(R)}function E(R){let v=n.get(R);i.deleteTexture(v.__webglTexture);let O=R.source,W=d.get(O);delete W[v.__cacheKey],o.memory.textures--}function M(R){let v=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(v.__webglFramebuffer[W]))for(let $=0;$<v.__webglFramebuffer[W].length;$++)i.deleteFramebuffer(v.__webglFramebuffer[W][$]);else i.deleteFramebuffer(v.__webglFramebuffer[W]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[W])}else{if(Array.isArray(v.__webglFramebuffer))for(let W=0;W<v.__webglFramebuffer.length;W++)i.deleteFramebuffer(v.__webglFramebuffer[W]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let W=0;W<v.__webglColorRenderbuffer.length;W++)v.__webglColorRenderbuffer[W]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[W]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let O=R.textures;for(let W=0,$=O.length;W<$;W++){let G=n.get(O[W]);G.__webglTexture&&(i.deleteTexture(G.__webglTexture),o.memory.textures--),n.remove(O[W])}n.remove(R)}let P=0;function F(){P=0}function V(){let R=P;return R>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),P+=1,R}function X(R){let v=[];return v.push(R.wrapS),v.push(R.wrapT),v.push(R.wrapR||0),v.push(R.magFilter),v.push(R.minFilter),v.push(R.anisotropy),v.push(R.internalFormat),v.push(R.format),v.push(R.type),v.push(R.generateMipmaps),v.push(R.premultiplyAlpha),v.push(R.flipY),v.push(R.unpackAlignment),v.push(R.colorSpace),v.join()}function j(R,v){let O=n.get(R);if(R.isVideoTexture&&ze(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){let W=R.image;if(W===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(O,R,v);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+v)}function z(R,v){let O=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){q(O,R,v);return}t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+v)}function K(R,v){let O=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){q(O,R,v);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+v)}function H(R,v){let O=n.get(R);if(R.version>0&&O.__version!==R.version){Z(O,R,v);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+v)}let ae={[Ti]:i.REPEAT,[Un]:i.CLAMP_TO_EDGE,[Ir]:i.MIRRORED_REPEAT},re={[Nt]:i.NEAREST,[Ra]:i.NEAREST_MIPMAP_NEAREST,[er]:i.NEAREST_MIPMAP_LINEAR,[Xt]:i.LINEAR,[Gr]:i.LINEAR_MIPMAP_NEAREST,[Ln]:i.LINEAR_MIPMAP_LINEAR},Ae={[Gd]:i.NEVER,[Zd]:i.ALWAYS,[Wd]:i.LESS,[Vc]:i.LEQUAL,[Xd]:i.EQUAL,[jd]:i.GEQUAL,[qd]:i.GREATER,[Yd]:i.NOTEQUAL};function Ge(R,v){if(v.type===yn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Xt||v.magFilter===Gr||v.magFilter===er||v.magFilter===Ln||v.minFilter===Xt||v.minFilter===Gr||v.minFilter===er||v.minFilter===Ln)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,ae[v.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,ae[v.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,ae[v.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,re[v.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,re[v.minFilter]),v.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,Ae[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Nt||v.minFilter!==er&&v.minFilter!==Ln||v.type===yn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function rt(R,v){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,v.addEventListener("dispose",w));let W=v.source,$=d.get(W);$===void 0&&($={},d.set(W,$));let G=X(v);if(G!==R.__cacheKey){$[G]===void 0&&($[G]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,O=!0),$[G].usedTimes++;let we=$[R.__cacheKey];we!==void 0&&($[R.__cacheKey].usedTimes--,we.usedTimes===0&&E(v)),R.__cacheKey=G,R.__webglTexture=$[G].texture}return O}function dt(R,v,O){return Math.floor(Math.floor(R/O)/v)}function Je(R,v,O,W){let G=R.updateRanges;if(G.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,v.width,v.height,O,W,v.data);else{G.sort((ee,ce)=>ee.start-ce.start);let we=0;for(let ee=1;ee<G.length;ee++){let ce=G[we],Pe=G[ee],Se=ce.start+ce.count,le=dt(Pe.start,v.width,4),Ve=dt(ce.start,v.width,4);Pe.start<=Se+1&&le===Ve&&dt(Pe.start+Pe.count-1,v.width,4)===le?ce.count=Math.max(ce.count,Pe.start+Pe.count-ce.start):(++we,G[we]=Pe)}G.length=we+1;let Q=i.getParameter(i.UNPACK_ROW_LENGTH),Ee=i.getParameter(i.UNPACK_SKIP_PIXELS),be=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,v.width);for(let ee=0,ce=G.length;ee<ce;ee++){let Pe=G[ee],Se=Math.floor(Pe.start/4),le=Math.ceil(Pe.count/4),Ve=Se%v.width,D=Math.floor(Se/v.width),te=le,se=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ve),i.pixelStorei(i.UNPACK_SKIP_ROWS,D),t.texSubImage2D(i.TEXTURE_2D,0,Ve,D,te,se,O,W,v.data)}R.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,Q),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ee),i.pixelStorei(i.UNPACK_SKIP_ROWS,be)}}function q(R,v,O){let W=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(W=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(W=i.TEXTURE_3D);let $=rt(R,v),G=v.source;t.bindTexture(W,R.__webglTexture,i.TEXTURE0+O);let we=n.get(G);if(G.version!==we.__version||$===!0){t.activeTexture(i.TEXTURE0+O);let Q=Ze.getPrimaries(Ze.workingColorSpace),Ee=v.colorSpace===gi?null:Ze.getPrimaries(v.colorSpace),be=v.colorSpace===gi||Q===Ee?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);let ee=_(v.image,!1,r.maxTextureSize);ee=St(v,ee);let ce=s.convert(v.format,v.colorSpace),Pe=s.convert(v.type),Se=b(v.internalFormat,ce,Pe,v.colorSpace,v.isVideoTexture);Ge(W,v);let le,Ve=v.mipmaps,D=v.isVideoTexture!==!0,te=we.__version===void 0||$===!0,se=G.dataReady,de=A(v,ee);if(v.isDepthTexture)Se=y(v.format===Yr,v.type),te&&(D?t.texStorage2D(i.TEXTURE_2D,1,Se,ee.width,ee.height):t.texImage2D(i.TEXTURE_2D,0,Se,ee.width,ee.height,0,ce,Pe,null));else if(v.isDataTexture)if(Ve.length>0){D&&te&&t.texStorage2D(i.TEXTURE_2D,de,Se,Ve[0].width,Ve[0].height);for(let J=0,Y=Ve.length;J<Y;J++)le=Ve[J],D?se&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,le.width,le.height,ce,Pe,le.data):t.texImage2D(i.TEXTURE_2D,J,Se,le.width,le.height,0,ce,Pe,le.data);v.generateMipmaps=!1}else D?(te&&t.texStorage2D(i.TEXTURE_2D,de,Se,ee.width,ee.height),se&&Je(v,ee,ce,Pe)):t.texImage2D(i.TEXTURE_2D,0,Se,ee.width,ee.height,0,ce,Pe,ee.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){D&&te&&t.texStorage3D(i.TEXTURE_2D_ARRAY,de,Se,Ve[0].width,Ve[0].height,ee.depth);for(let J=0,Y=Ve.length;J<Y;J++)if(le=Ve[J],v.format!==jt)if(ce!==null)if(D){if(se)if(v.layerUpdates.size>0){let ge=Zc(le.width,le.height,v.format,v.type);for(let He of v.layerUpdates){let it=le.data.subarray(He*ge/le.data.BYTES_PER_ELEMENT,(He+1)*ge/le.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,He,le.width,le.height,1,ce,it)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,le.width,le.height,ee.depth,ce,le.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,Se,le.width,le.height,ee.depth,0,le.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?se&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,le.width,le.height,ee.depth,ce,Pe,le.data):t.texImage3D(i.TEXTURE_2D_ARRAY,J,Se,le.width,le.height,ee.depth,0,ce,Pe,le.data)}else{D&&te&&t.texStorage2D(i.TEXTURE_2D,de,Se,Ve[0].width,Ve[0].height);for(let J=0,Y=Ve.length;J<Y;J++)le=Ve[J],v.format!==jt?ce!==null?D?se&&t.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,le.width,le.height,ce,le.data):t.compressedTexImage2D(i.TEXTURE_2D,J,Se,le.width,le.height,0,le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?se&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,le.width,le.height,ce,Pe,le.data):t.texImage2D(i.TEXTURE_2D,J,Se,le.width,le.height,0,ce,Pe,le.data)}else if(v.isDataArrayTexture)if(D){if(te&&t.texStorage3D(i.TEXTURE_2D_ARRAY,de,Se,ee.width,ee.height,ee.depth),se)if(v.layerUpdates.size>0){let J=Zc(ee.width,ee.height,v.format,v.type);for(let Y of v.layerUpdates){let ge=ee.data.subarray(Y*J/ee.data.BYTES_PER_ELEMENT,(Y+1)*J/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Y,ee.width,ee.height,1,ce,Pe,ge)}v.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,ce,Pe,ee.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Se,ee.width,ee.height,ee.depth,0,ce,Pe,ee.data);else if(v.isData3DTexture)D?(te&&t.texStorage3D(i.TEXTURE_3D,de,Se,ee.width,ee.height,ee.depth),se&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,ce,Pe,ee.data)):t.texImage3D(i.TEXTURE_3D,0,Se,ee.width,ee.height,ee.depth,0,ce,Pe,ee.data);else if(v.isFramebufferTexture){if(te)if(D)t.texStorage2D(i.TEXTURE_2D,de,Se,ee.width,ee.height);else{let J=ee.width,Y=ee.height;for(let ge=0;ge<de;ge++)t.texImage2D(i.TEXTURE_2D,ge,Se,J,Y,0,ce,Pe,null),J>>=1,Y>>=1}}else if(Ve.length>0){if(D&&te){let J=Et(Ve[0]);t.texStorage2D(i.TEXTURE_2D,de,Se,J.width,J.height)}for(let J=0,Y=Ve.length;J<Y;J++)le=Ve[J],D?se&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,ce,Pe,le):t.texImage2D(i.TEXTURE_2D,J,Se,ce,Pe,le);v.generateMipmaps=!1}else if(D){if(te){let J=Et(ee);t.texStorage2D(i.TEXTURE_2D,de,Se,J.width,J.height)}se&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ce,Pe,ee)}else t.texImage2D(i.TEXTURE_2D,0,Se,ce,Pe,ee);m(v)&&p(W),we.__version=G.version,v.onUpdate&&v.onUpdate(v)}R.__version=v.version}function Z(R,v,O){if(v.image.length!==6)return;let W=rt(R,v),$=v.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+O);let G=n.get($);if($.version!==G.__version||W===!0){t.activeTexture(i.TEXTURE0+O);let we=Ze.getPrimaries(Ze.workingColorSpace),Q=v.colorSpace===gi?null:Ze.getPrimaries(v.colorSpace),Ee=v.colorSpace===gi||we===Q?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee);let be=v.isCompressedTexture||v.image[0].isCompressedTexture,ee=v.image[0]&&v.image[0].isDataTexture,ce=[];for(let Y=0;Y<6;Y++)!be&&!ee?ce[Y]=_(v.image[Y],!0,r.maxCubemapSize):ce[Y]=ee?v.image[Y].image:v.image[Y],ce[Y]=St(v,ce[Y]);let Pe=ce[0],Se=s.convert(v.format,v.colorSpace),le=s.convert(v.type),Ve=b(v.internalFormat,Se,le,v.colorSpace),D=v.isVideoTexture!==!0,te=G.__version===void 0||W===!0,se=$.dataReady,de=A(v,Pe);Ge(i.TEXTURE_CUBE_MAP,v);let J;if(be){D&&te&&t.texStorage2D(i.TEXTURE_CUBE_MAP,de,Ve,Pe.width,Pe.height);for(let Y=0;Y<6;Y++){J=ce[Y].mipmaps;for(let ge=0;ge<J.length;ge++){let He=J[ge];v.format!==jt?Se!==null?D?se&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge,0,0,He.width,He.height,Se,He.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge,Ve,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge,0,0,He.width,He.height,Se,le,He.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge,Ve,He.width,He.height,0,Se,le,He.data)}}}else{if(J=v.mipmaps,D&&te){J.length>0&&de++;let Y=Et(ce[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,de,Ve,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(ee){D?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,ce[Y].width,ce[Y].height,Se,le,ce[Y].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Ve,ce[Y].width,ce[Y].height,0,Se,le,ce[Y].data);for(let ge=0;ge<J.length;ge++){let it=J[ge].image[Y].image;D?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge+1,0,0,it.width,it.height,Se,le,it.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge+1,Ve,it.width,it.height,0,Se,le,it.data)}}else{D?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,Se,le,ce[Y]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Ve,Se,le,ce[Y]);for(let ge=0;ge<J.length;ge++){let He=J[ge];D?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge+1,0,0,Se,le,He.image[Y]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge+1,Ve,Se,le,He.image[Y])}}}m(v)&&p(i.TEXTURE_CUBE_MAP),G.__version=$.version,v.onUpdate&&v.onUpdate(v)}R.__version=v.version}function pe(R,v,O,W,$,G){let we=s.convert(O.format,O.colorSpace),Q=s.convert(O.type),Ee=b(O.internalFormat,we,Q,O.colorSpace),be=n.get(v),ee=n.get(O);if(ee.__renderTarget=v,!be.__hasExternalTextures){let ce=Math.max(1,v.width>>G),Pe=Math.max(1,v.height>>G);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?t.texImage3D($,G,Ee,ce,Pe,v.depth,0,we,Q,null):t.texImage2D($,G,Ee,ce,Pe,0,we,Q,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),ye(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,W,$,ee.__webglTexture,0,pt(v)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,W,$,ee.__webglTexture,G),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Oe(R,v,O){if(i.bindRenderbuffer(i.RENDERBUFFER,R),v.depthBuffer){let W=v.depthTexture,$=W&&W.isDepthTexture?W.type:null,G=y(v.stencilBuffer,$),we=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=pt(v);ye(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Q,G,v.width,v.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,Q,G,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,G,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,we,i.RENDERBUFFER,R)}else{let W=v.textures;for(let $=0;$<W.length;$++){let G=W[$],we=s.convert(G.format,G.colorSpace),Q=s.convert(G.type),Ee=b(G.internalFormat,we,Q,G.colorSpace),be=pt(v);O&&ye(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,be,Ee,v.width,v.height):ye(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,be,Ee,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,Ee,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Te(R,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let W=n.get(v.depthTexture);W.__renderTarget=v,(!W.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),j(v.depthTexture,0);let $=W.__webglTexture,G=pt(v);if(v.depthTexture.format===Lr)ye(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0,G):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0);else if(v.depthTexture.format===Yr)ye(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0,G):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function Xe(R){let v=n.get(R),O=R.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==R.depthTexture){let W=R.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),W){let $=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,W.removeEventListener("dispose",$)};W.addEventListener("dispose",$),v.__depthDisposeCallback=$}v.__boundDepthTexture=W}if(R.depthTexture&&!v.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");let W=R.texture.mipmaps;W&&W.length>0?Te(v.__webglFramebuffer[0],R):Te(v.__webglFramebuffer,R)}else if(O){v.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[W]),v.__webglDepthbuffer[W]===void 0)v.__webglDepthbuffer[W]=i.createRenderbuffer(),Oe(v.__webglDepthbuffer[W],R,!1);else{let $=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,G=v.__webglDepthbuffer[W];i.bindRenderbuffer(i.RENDERBUFFER,G),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,G)}}else{let W=R.texture.mipmaps;if(W&&W.length>0?t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),Oe(v.__webglDepthbuffer,R,!1);else{let $=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,G=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,G),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,G)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ct(R,v,O){let W=n.get(R);v!==void 0&&pe(W.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Xe(R)}function I(R){let v=R.texture,O=n.get(R),W=n.get(v);R.addEventListener("dispose",C);let $=R.textures,G=R.isWebGLCubeRenderTarget===!0,we=$.length>1;if(we||(W.__webglTexture===void 0&&(W.__webglTexture=i.createTexture()),W.__version=v.version,o.memory.textures++),G){O.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer[Q]=[];for(let Ee=0;Ee<v.mipmaps.length;Ee++)O.__webglFramebuffer[Q][Ee]=i.createFramebuffer()}else O.__webglFramebuffer[Q]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer=[];for(let Q=0;Q<v.mipmaps.length;Q++)O.__webglFramebuffer[Q]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(we)for(let Q=0,Ee=$.length;Q<Ee;Q++){let be=n.get($[Q]);be.__webglTexture===void 0&&(be.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&ye(R)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let Q=0;Q<$.length;Q++){let Ee=$[Q];O.__webglColorRenderbuffer[Q]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[Q]);let be=s.convert(Ee.format,Ee.colorSpace),ee=s.convert(Ee.type),ce=b(Ee.internalFormat,be,ee,Ee.colorSpace,R.isXRRenderTarget===!0),Pe=pt(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Pe,ce,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Q,i.RENDERBUFFER,O.__webglColorRenderbuffer[Q])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Oe(O.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(G){t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture),Ge(i.TEXTURE_CUBE_MAP,v);for(let Q=0;Q<6;Q++)if(v.mipmaps&&v.mipmaps.length>0)for(let Ee=0;Ee<v.mipmaps.length;Ee++)pe(O.__webglFramebuffer[Q][Ee],R,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee);else pe(O.__webglFramebuffer[Q],R,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);m(v)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(we){for(let Q=0,Ee=$.length;Q<Ee;Q++){let be=$[Q],ee=n.get(be),ce=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ce=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ce,ee.__webglTexture),Ge(ce,be),pe(O.__webglFramebuffer,R,be,i.COLOR_ATTACHMENT0+Q,ce,0),m(be)&&p(ce)}t.unbindTexture()}else{let Q=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Q=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Q,W.__webglTexture),Ge(Q,v),v.mipmaps&&v.mipmaps.length>0)for(let Ee=0;Ee<v.mipmaps.length;Ee++)pe(O.__webglFramebuffer[Ee],R,v,i.COLOR_ATTACHMENT0,Q,Ee);else pe(O.__webglFramebuffer,R,v,i.COLOR_ATTACHMENT0,Q,0);m(v)&&p(Q),t.unbindTexture()}R.depthBuffer&&Xe(R)}function ft(R){let v=R.textures;for(let O=0,W=v.length;O<W;O++){let $=v[O];if(m($)){let G=T(R),we=n.get($).__webglTexture;t.bindTexture(G,we),p(G),t.unbindTexture()}}}let ke=[],De=[];function ve(R){if(R.samples>0){if(ye(R)===!1){let v=R.textures,O=R.width,W=R.height,$=i.COLOR_BUFFER_BIT,G=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,we=n.get(R),Q=v.length>1;if(Q)for(let be=0;be<v.length;be++)t.bindFramebuffer(i.FRAMEBUFFER,we.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,we.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer);let Ee=R.texture.mipmaps;Ee&&Ee.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let be=0;be<v.length;be++){if(R.resolveDepthBuffer&&(R.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),Q){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,we.__webglColorRenderbuffer[be]);let ee=n.get(v[be]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ee,0)}i.blitFramebuffer(0,0,O,W,0,0,O,W,$,i.NEAREST),l===!0&&(ke.length=0,De.length=0,ke.push(i.COLOR_ATTACHMENT0+be),R.depthBuffer&&R.resolveDepthBuffer===!1&&(ke.push(G),De.push(G),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,De)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ke))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Q)for(let be=0;be<v.length;be++){t.bindFramebuffer(i.FRAMEBUFFER,we.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,we.__webglColorRenderbuffer[be]);let ee=n.get(v[be]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,we.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,ee,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let v=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function pt(R){return Math.min(r.maxSamples,R.samples)}function ye(R){let v=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function ze(R){let v=o.render.frame;u.get(R)!==v&&(u.set(R,v),R.update())}function St(R,v){let O=R.colorSpace,W=R.format,$=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==Ut&&O!==gi&&(Ze.getTransfer(O)===ot?(W!==jt||$!==ln)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),v}function Et(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=V,this.resetTextureUnits=F,this.setTexture2D=j,this.setTexture2DArray=z,this.setTexture3D=K,this.setTextureCube=H,this.rebindTextures=Ct,this.setupRenderTarget=I,this.updateRenderTargetMipmap=ft,this.updateMultisampleRenderTarget=ve,this.setupDepthRenderbuffer=Xe,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=ye}function y0(i,e){function t(n,r=gi){let s,o=Ze.getTransfer(r);if(n===ln)return i.UNSIGNED_BYTE;if(n===Pa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ia)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Uc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Oc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Dc)return i.BYTE;if(n===Nc)return i.SHORT;if(n===Wr)return i.UNSIGNED_SHORT;if(n===Ca)return i.INT;if(n===Ai)return i.UNSIGNED_INT;if(n===yn)return i.FLOAT;if(n===Xr)return i.HALF_FLOAT;if(n===Fc)return i.ALPHA;if(n===Bc)return i.RGB;if(n===jt)return i.RGBA;if(n===Lr)return i.DEPTH_COMPONENT;if(n===Yr)return i.DEPTH_STENCIL;if(n===La)return i.RED;if(n===Da)return i.RED_INTEGER;if(n===kc)return i.RG;if(n===Na)return i.RG_INTEGER;if(n===Ua)return i.RGBA_INTEGER;if(n===ro||n===so||n===oo||n===ao)if(o===ot)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ro)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===so)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===oo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ao)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ro)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===so)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===oo)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ao)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Oa||n===Fa||n===Ba||n===ka)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Oa)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Fa)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ba)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ka)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ha||n===Va||n===za)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Ha||n===Va)return o===ot?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===za)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ga||n===Wa||n===Xa||n===qa||n===Ya||n===ja||n===Za||n===$a||n===Ja||n===Ka||n===Qa||n===el||n===tl||n===nl)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Ga)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Wa)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Xa)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===qa)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ya)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ja)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Za)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===$a)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ja)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ka)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Qa)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===el)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===tl)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===nl)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===il||n===rl||n===sl)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===il)return o===ot?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===rl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===sl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ol||n===al||n===ll||n===cl)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===ol)return s.COMPRESSED_RED_RGTC1_EXT;if(n===al)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ll)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===cl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===qr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var x0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,M0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,lu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Ws(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new on({vertexShader:x0,fragmentShader:M0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Mt(new Xs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},cu=class extends Fn{constructor(e,t){super();let n=this,r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,g=null,_=typeof XRWebGLBinding<"u",m=new lu,p={},T=t.getContextAttributes(),b=null,y=null,A=[],w=[],C=new Le,L=null,E=new Rt;E.viewport=new et;let M=new Rt;M.viewport=new et;let P=[E,M],F=new ga,V=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let Z=A[q];return Z===void 0&&(Z=new Fr,A[q]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(q){let Z=A[q];return Z===void 0&&(Z=new Fr,A[q]=Z),Z.getGripSpace()},this.getHand=function(q){let Z=A[q];return Z===void 0&&(Z=new Fr,A[q]=Z),Z.getHandSpace()};function j(q){let Z=w.indexOf(q.inputSource);if(Z===-1)return;let pe=A[Z];pe!==void 0&&(pe.update(q.inputSource,q.frame,c||o),pe.dispatchEvent({type:q.type,data:q.inputSource}))}function z(){r.removeEventListener("select",j),r.removeEventListener("selectstart",j),r.removeEventListener("selectend",j),r.removeEventListener("squeeze",j),r.removeEventListener("squeezestart",j),r.removeEventListener("squeezeend",j),r.removeEventListener("end",z),r.removeEventListener("inputsourceschange",K);for(let q=0;q<A.length;q++){let Z=w[q];Z!==null&&(w[q]=null,A[q].disconnect(Z))}V=null,X=null,m.reset();for(let q in p)delete p[q];e.setRenderTarget(b),f=null,d=null,h=null,r=null,y=null,Je.stop(),n.isPresenting=!1,e.setPixelRatio(L),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(q){if(r=q,r!==null){if(b=e.getRenderTarget(),r.addEventListener("select",j),r.addEventListener("selectstart",j),r.addEventListener("selectend",j),r.addEventListener("squeeze",j),r.addEventListener("squeezestart",j),r.addEventListener("squeezeend",j),r.addEventListener("end",z),r.addEventListener("inputsourceschange",K),T.xrCompatible!==!0&&await t.makeXRCompatible(),L=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,Oe=null,Te=null;T.depth&&(Te=T.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=T.stencil?Yr:Lr,Oe=T.stencil?qr:Ai);let Xe={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(Xe),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new mn(d.textureWidth,d.textureHeight,{format:jt,type:ln,depthTexture:new Gs(d.textureWidth,d.textureHeight,Oe,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:T.stencil,colorSpace:e.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let pe={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,pe),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new mn(f.framebufferWidth,f.framebufferHeight,{format:jt,type:ln,colorSpace:e.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Je.setContext(r),Je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function K(q){for(let Z=0;Z<q.removed.length;Z++){let pe=q.removed[Z],Oe=w.indexOf(pe);Oe>=0&&(w[Oe]=null,A[Oe].disconnect(pe))}for(let Z=0;Z<q.added.length;Z++){let pe=q.added[Z],Oe=w.indexOf(pe);if(Oe===-1){for(let Xe=0;Xe<A.length;Xe++)if(Xe>=w.length){w.push(pe),Oe=Xe;break}else if(w[Xe]===null){w[Xe]=pe,Oe=Xe;break}if(Oe===-1)break}let Te=A[Oe];Te&&Te.connect(pe)}}let H=new S,ae=new S;function re(q,Z,pe){H.setFromMatrixPosition(Z.matrixWorld),ae.setFromMatrixPosition(pe.matrixWorld);let Oe=H.distanceTo(ae),Te=Z.projectionMatrix.elements,Xe=pe.projectionMatrix.elements,Ct=Te[14]/(Te[10]-1),I=Te[14]/(Te[10]+1),ft=(Te[9]+1)/Te[5],ke=(Te[9]-1)/Te[5],De=(Te[8]-1)/Te[0],ve=(Xe[8]+1)/Xe[0],pt=Ct*De,ye=Ct*ve,ze=Oe/(-De+ve),St=ze*-De;if(Z.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(St),q.translateZ(ze),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Te[10]===-1)q.projectionMatrix.copy(Z.projectionMatrix),q.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{let Et=Ct+ze,R=I+ze,v=pt-St,O=ye+(Oe-St),W=ft*I/R*Et,$=ke*I/R*Et;q.projectionMatrix.makePerspective(v,O,W,$,Et,R),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function Ae(q,Z){Z===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(Z.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(r===null)return;let Z=q.near,pe=q.far;m.texture!==null&&(m.depthNear>0&&(Z=m.depthNear),m.depthFar>0&&(pe=m.depthFar)),F.near=M.near=E.near=Z,F.far=M.far=E.far=pe,(V!==F.near||X!==F.far)&&(r.updateRenderState({depthNear:F.near,depthFar:F.far}),V=F.near,X=F.far),F.layers.mask=q.layers.mask|6,E.layers.mask=F.layers.mask&3,M.layers.mask=F.layers.mask&5;let Oe=q.parent,Te=F.cameras;Ae(F,Oe);for(let Xe=0;Xe<Te.length;Xe++)Ae(Te[Xe],Oe);Te.length===2?re(F,E,M):F.projectionMatrix.copy(E.projectionMatrix),Ge(q,F,Oe)};function Ge(q,Z,pe){pe===null?q.matrix.copy(Z.matrixWorld):(q.matrix.copy(pe.matrixWorld),q.matrix.invert(),q.matrix.multiply(Z.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(Z.projectionMatrix),q.projectionMatrixInverse.copy(Z.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=qi*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(q){l=q,d!==null&&(d.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(q){return p[q]};let rt=null;function dt(q,Z){if(u=Z.getViewerPose(c||o),g=Z,u!==null){let pe=u.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let Oe=!1;pe.length!==F.cameras.length&&(F.cameras.length=0,Oe=!0);for(let I=0;I<pe.length;I++){let ft=pe[I],ke=null;if(f!==null)ke=f.getViewport(ft);else{let ve=h.getViewSubImage(d,ft);ke=ve.viewport,I===0&&(e.setRenderTargetTextures(y,ve.colorTexture,ve.depthStencilTexture),e.setRenderTarget(y))}let De=P[I];De===void 0&&(De=new Rt,De.layers.enable(I),De.viewport=new et,P[I]=De),De.matrix.fromArray(ft.transform.matrix),De.matrix.decompose(De.position,De.quaternion,De.scale),De.projectionMatrix.fromArray(ft.projectionMatrix),De.projectionMatrixInverse.copy(De.projectionMatrix).invert(),De.viewport.set(ke.x,ke.y,ke.width,ke.height),I===0&&(F.matrix.copy(De.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Oe===!0&&F.cameras.push(De)}let Te=r.enabledFeatures;if(Te&&Te.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){h=n.getBinding();let I=h.getDepthInformation(pe[0]);I&&I.isValid&&I.texture&&m.init(I,r.renderState)}if(Te&&Te.includes("camera-access")&&_){e.state.unbindTexture(),h=n.getBinding();for(let I=0;I<pe.length;I++){let ft=pe[I].camera;if(ft){let ke=p[ft];ke||(ke=new Ws,p[ft]=ke);let De=h.getCameraImage(ft);ke.sourceTexture=De}}}}for(let pe=0;pe<A.length;pe++){let Oe=w[pe],Te=A[pe];Oe!==null&&Te!==void 0&&Te.update(Oe,Z,c||o)}rt&&rt(q,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}let Je=new Tf;Je.setAnimationLoop(dt),this.setAnimationLoop=function(q){rt=q},this.dispose=function(){}}},ir=new xt,E0=new Me;function b0(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,qc(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,T,b,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),h(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,T,b):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ot&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ot&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let T=e.get(p),b=T.envMap,y=T.envMapRotation;b&&(m.envMap.value=b,ir.copy(y),ir.x*=-1,ir.y*=-1,ir.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(ir.y*=-1,ir.z*=-1),m.envMapRotation.value.setFromMatrix4(E0.makeRotationFromEuler(ir)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,T,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*T,m.scale.value=b*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,T){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ot&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let T=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function S0(i,e,t,n){let r={},s={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,b){let y=b.program;n.uniformBlockBinding(T,y)}function c(T,b){let y=r[T.id];y===void 0&&(g(T),y=u(T),r[T.id]=y,T.addEventListener("dispose",m));let A=b.program;n.updateUBOMapping(T,A);let w=e.render.frame;s[T.id]!==w&&(d(T),s[T.id]=w)}function u(T){let b=h();T.__bindingPointIndex=b;let y=i.createBuffer(),A=T.__size,w=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,A,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,y),y}function h(){for(let T=0;T<a;T++)if(o.indexOf(T)===-1)return o.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(T){let b=r[T.id],y=T.uniforms,A=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let w=0,C=y.length;w<C;w++){let L=Array.isArray(y[w])?y[w]:[y[w]];for(let E=0,M=L.length;E<M;E++){let P=L[E];if(f(P,w,E,A)===!0){let F=P.__offset,V=Array.isArray(P.value)?P.value:[P.value],X=0;for(let j=0;j<V.length;j++){let z=V[j],K=_(z);typeof z=="number"||typeof z=="boolean"?(P.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,F+X,P.__data)):z.isMatrix3?(P.__data[0]=z.elements[0],P.__data[1]=z.elements[1],P.__data[2]=z.elements[2],P.__data[3]=0,P.__data[4]=z.elements[3],P.__data[5]=z.elements[4],P.__data[6]=z.elements[5],P.__data[7]=0,P.__data[8]=z.elements[6],P.__data[9]=z.elements[7],P.__data[10]=z.elements[8],P.__data[11]=0):(z.toArray(P.__data,X),X+=K.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(T,b,y,A){let w=T.value,C=b+"_"+y;if(A[C]===void 0)return typeof w=="number"||typeof w=="boolean"?A[C]=w:A[C]=w.clone(),!0;{let L=A[C];if(typeof w=="number"||typeof w=="boolean"){if(L!==w)return A[C]=w,!0}else if(L.equals(w)===!1)return L.copy(w),!0}return!1}function g(T){let b=T.uniforms,y=0,A=16;for(let C=0,L=b.length;C<L;C++){let E=Array.isArray(b[C])?b[C]:[b[C]];for(let M=0,P=E.length;M<P;M++){let F=E[M],V=Array.isArray(F.value)?F.value:[F.value];for(let X=0,j=V.length;X<j;X++){let z=V[X],K=_(z),H=y%A,ae=H%K.boundary,re=H+ae;y+=ae,re!==0&&A-re<K.storage&&(y+=A-re),F.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=K.storage}}}let w=y%A;return w>0&&(y+=A-w),T.__size=y,T.__cache={},this}function _(T){let b={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(b.boundary=4,b.storage=4):T.isVector2?(b.boundary=8,b.storage=8):T.isVector3||T.isColor?(b.boundary=16,b.storage=12):T.isVector4?(b.boundary=16,b.storage=16):T.isMatrix3?(b.boundary=48,b.storage=48):T.isMatrix4?(b.boundary=64,b.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),b}function m(T){let b=T.target;b.removeEventListener("dispose",m);let y=o.indexOf(b.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(r[b.id]),delete r[b.id],delete s[b.id]}function p(){for(let T in r)i.deleteBuffer(r[T]);o=[],r={},s={}}return{bind:l,update:c,dispose:p}}var vl=class{constructor(e={}){let{canvas:t=$d(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,p=null,T=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=mi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,A=!1;this._outputColorSpace=Tt;let w=0,C=0,L=null,E=-1,M=null,P=new et,F=new et,V=null,X=new he(0),j=0,z=t.width,K=t.height,H=1,ae=null,re=null,Ae=new et(0,0,z,K),Ge=new et(0,0,z,K),rt=!1,dt=new kr,Je=!1,q=!1,Z=new Me,pe=new S,Oe=new et,Te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Xe=!1;function Ct(){return L===null?H:1}let I=n;function ft(x,N){return t.getContext(x,N)}try{let x={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",se,!1),t.addEventListener("webglcontextrestored",de,!1),t.addEventListener("webglcontextcreationerror",J,!1),I===null){let N="webgl2";if(I=ft(N,x),I===null)throw ft(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let ke,De,ve,pt,ye,ze,St,Et,R,v,O,W,$,G,we,Q,Ee,be,ee,ce,Pe,Se,le,Ve;function D(){ke=new zy(I),ke.init(),Se=new y0(I,ke),De=new Uy(I,ke,e,Se),ve=new _0(I,ke),De.reversedDepthBuffer&&d&&ve.buffers.depth.setReversed(!0),pt=new Xy(I),ye=new r0,ze=new v0(I,ke,ve,ye,De,Se,pt),St=new Fy(y),Et=new Vy(y),R=new Jg(I),le=new Dy(I,R),v=new Gy(I,R,pt,le),O=new Yy(I,v,R,pt),ee=new qy(I,De,ze),Q=new Oy(ye),W=new i0(y,St,Et,ke,De,le,Q),$=new b0(y,ye),G=new o0,we=new d0(ke),be=new Ly(y,St,Et,ve,O,f,l),Ee=new m0(y,O,De),Ve=new S0(I,pt,De,ve),ce=new Ny(I,ke,pt),Pe=new Wy(I,ke,pt),pt.programs=W.programs,y.capabilities=De,y.extensions=ke,y.properties=ye,y.renderLists=G,y.shadowMap=Ee,y.state=ve,y.info=pt}D();let te=new cu(y,I);this.xr=te,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let x=ke.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){let x=ke.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(x){x!==void 0&&(H=x,this.setSize(z,K,!1))},this.getSize=function(x){return x.set(z,K)},this.setSize=function(x,N,B=!0){if(te.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=x,K=N,t.width=Math.floor(x*H),t.height=Math.floor(N*H),B===!0&&(t.style.width=x+"px",t.style.height=N+"px"),this.setViewport(0,0,x,N)},this.getDrawingBufferSize=function(x){return x.set(z*H,K*H).floor()},this.setDrawingBufferSize=function(x,N,B){z=x,K=N,H=B,t.width=Math.floor(x*B),t.height=Math.floor(N*B),this.setViewport(0,0,x,N)},this.getCurrentViewport=function(x){return x.copy(P)},this.getViewport=function(x){return x.copy(Ae)},this.setViewport=function(x,N,B,k){x.isVector4?Ae.set(x.x,x.y,x.z,x.w):Ae.set(x,N,B,k),ve.viewport(P.copy(Ae).multiplyScalar(H).round())},this.getScissor=function(x){return x.copy(Ge)},this.setScissor=function(x,N,B,k){x.isVector4?Ge.set(x.x,x.y,x.z,x.w):Ge.set(x,N,B,k),ve.scissor(F.copy(Ge).multiplyScalar(H).round())},this.getScissorTest=function(){return rt},this.setScissorTest=function(x){ve.setScissorTest(rt=x)},this.setOpaqueSort=function(x){ae=x},this.setTransparentSort=function(x){re=x},this.getClearColor=function(x){return x.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor(...arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha(...arguments)},this.clear=function(x=!0,N=!0,B=!0){let k=0;if(x){let U=!1;if(L!==null){let ne=L.texture.format;U=ne===Ua||ne===Na||ne===Da}if(U){let ne=L.texture.type,ue=ne===ln||ne===Ai||ne===Wr||ne===qr||ne===Pa||ne===Ia,xe=be.getClearColor(),fe=be.getClearAlpha(),Ue=xe.r,Fe=xe.g,Ce=xe.b;ue?(g[0]=Ue,g[1]=Fe,g[2]=Ce,g[3]=fe,I.clearBufferuiv(I.COLOR,0,g)):(_[0]=Ue,_[1]=Fe,_[2]=Ce,_[3]=fe,I.clearBufferiv(I.COLOR,0,_))}else k|=I.COLOR_BUFFER_BIT}N&&(k|=I.DEPTH_BUFFER_BIT),B&&(k|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",se,!1),t.removeEventListener("webglcontextrestored",de,!1),t.removeEventListener("webglcontextcreationerror",J,!1),be.dispose(),G.dispose(),we.dispose(),ye.dispose(),St.dispose(),Et.dispose(),O.dispose(),le.dispose(),Ve.dispose(),W.dispose(),te.dispose(),te.removeEventListener("sessionstart",hn),te.removeEventListener("sessionend",gs),$n.stop()};function se(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function de(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;let x=pt.autoReset,N=Ee.enabled,B=Ee.autoUpdate,k=Ee.needsUpdate,U=Ee.type;D(),pt.autoReset=x,Ee.enabled=N,Ee.autoUpdate=B,Ee.needsUpdate=k,Ee.type=U}function J(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function Y(x){let N=x.target;N.removeEventListener("dispose",Y),ge(N)}function ge(x){He(x),ye.remove(x)}function He(x){let N=ye.get(x).programs;N!==void 0&&(N.forEach(function(B){W.releaseProgram(B)}),x.isShaderMaterial&&W.releaseShaderCache(x))}this.renderBufferDirect=function(x,N,B,k,U,ne){N===null&&(N=Te);let ue=U.isMesh&&U.matrixWorld.determinant()<0,xe=Sh(x,N,B,k,U);ve.setMaterial(k,ue);let fe=B.index,Ue=1;if(k.wireframe===!0){if(fe=v.getWireframeAttribute(B),fe===void 0)return;Ue=2}let Fe=B.drawRange,Ce=B.attributes.position,je=Fe.start*Ue,at=(Fe.start+Fe.count)*Ue;ne!==null&&(je=Math.max(je,ne.start*Ue),at=Math.min(at,(ne.start+ne.count)*Ue)),fe!==null?(je=Math.max(je,0),at=Math.min(at,fe.count)):Ce!=null&&(je=Math.max(je,0),at=Math.min(at,Ce.count));let bt=at-je;if(bt<0||bt===1/0)return;le.setup(U,k,xe,B,fe);let gt,mt=ce;if(fe!==null&&(gt=R.get(fe),mt=Pe,mt.setIndex(gt)),U.isMesh)k.wireframe===!0?(ve.setLineWidth(k.wireframeLinewidth*Ct()),mt.setMode(I.LINES)):mt.setMode(I.TRIANGLES);else if(U.isLine){let Ie=k.linewidth;Ie===void 0&&(Ie=1),ve.setLineWidth(Ie*Ct()),U.isLineSegments?mt.setMode(I.LINES):U.isLineLoop?mt.setMode(I.LINE_LOOP):mt.setMode(I.LINE_STRIP)}else U.isPoints?mt.setMode(I.POINTS):U.isSprite&&mt.setMode(I.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Nr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),mt.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(ke.get("WEBGL_multi_draw"))mt.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{let Ie=U._multiDrawStarts,vt=U._multiDrawCounts,Qe=U._multiDrawCount,tn=fe?R.get(fe).bytesPerElement:1,mr=ye.get(k).currentProgram.getUniforms();for(let nn=0;nn<Qe;nn++)mr.setValue(I,"_gl_DrawID",nn),mt.render(Ie[nn]/tn,vt[nn])}else if(U.isInstancedMesh)mt.renderInstances(je,bt,U.count);else if(B.isInstancedBufferGeometry){let Ie=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,vt=Math.min(B.instanceCount,Ie);mt.renderInstances(je,bt,vt)}else mt.render(je,bt)};function it(x,N,B){x.transparent===!0&&x.side===Yt&&x.forceSinglePass===!1?(x.side=Ot,x.needsUpdate=!0,Di(x,N,B),x.side=In,x.needsUpdate=!0,Di(x,N,B),x.side=Yt):Di(x,N,B)}this.compile=function(x,N,B=null){B===null&&(B=x),p=we.get(B),p.init(N),b.push(p),B.traverseVisible(function(U){U.isLight&&U.layers.test(N.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),x!==B&&x.traverseVisible(function(U){U.isLight&&U.layers.test(N.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),p.setupLights();let k=new Set;return x.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;let ne=U.material;if(ne)if(Array.isArray(ne))for(let ue=0;ue<ne.length;ue++){let xe=ne[ue];it(xe,B,U),k.add(xe)}else it(ne,B,U),k.add(ne)}),p=b.pop(),k},this.compileAsync=function(x,N,B=null){let k=this.compile(x,N,B);return new Promise(U=>{function ne(){if(k.forEach(function(ue){ye.get(ue).currentProgram.isReady()&&k.delete(ue)}),k.size===0){U(x);return}setTimeout(ne,10)}ke.get("KHR_parallel_shader_compile")!==null?ne():setTimeout(ne,10)})};let Ke=null;function Sn(x){Ke&&Ke(x)}function hn(){$n.stop()}function gs(){$n.start()}let $n=new Tf;$n.setAnimationLoop(Sn),typeof self<"u"&&$n.setContext(self),this.setAnimationLoop=function(x){Ke=x,te.setAnimationLoop(x),x===null?$n.stop():$n.start()},te.addEventListener("sessionstart",hn),te.addEventListener("sessionend",gs),this.render=function(x,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),te.enabled===!0&&te.isPresenting===!0&&(te.cameraAutoUpdate===!0&&te.updateCamera(N),N=te.getCamera()),x.isScene===!0&&x.onBeforeRender(y,x,N,L),p=we.get(x,b.length),p.init(N),b.push(p),Z.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),dt.setFromProjectionMatrix(Z,Cn,N.reversedDepth),q=this.localClippingEnabled,Je=Q.init(this.clippingPlanes,q),m=G.get(x,T.length),m.init(),T.push(m),te.enabled===!0&&te.isPresenting===!0){let ne=y.xr.getDepthSensingMesh();ne!==null&&_s(ne,N,-1/0,y.sortObjects)}_s(x,N,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(ae,re),Xe=te.enabled===!1||te.isPresenting===!1||te.hasDepthSensing()===!1,Xe&&be.addToRenderList(m,x),this.info.render.frame++,Je===!0&&Q.beginShadows();let B=p.state.shadowsArray;Ee.render(B,x,N),Je===!0&&Q.endShadows(),this.info.autoReset===!0&&this.info.reset();let k=m.opaque,U=m.transmissive;if(p.setupLights(),N.isArrayCamera){let ne=N.cameras;if(U.length>0)for(let ue=0,xe=ne.length;ue<xe;ue++){let fe=ne[ue];To(k,U,x,fe)}Xe&&be.render(x);for(let ue=0,xe=ne.length;ue<xe;ue++){let fe=ne[ue];So(m,x,fe,fe.viewport)}}else U.length>0&&To(k,U,x,N),Xe&&be.render(x),So(m,x,N);L!==null&&C===0&&(ze.updateMultisampleRenderTarget(L),ze.updateRenderTargetMipmap(L)),x.isScene===!0&&x.onAfterRender(y,x,N),le.resetDefaultState(),E=-1,M=null,b.pop(),b.length>0?(p=b[b.length-1],Je===!0&&Q.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,T.pop(),T.length>0?m=T[T.length-1]:m=null};function _s(x,N,B,k){if(x.visible===!1)return;if(x.layers.test(N.layers)){if(x.isGroup)B=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(N);else if(x.isLight)p.pushLight(x),x.castShadow&&p.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||dt.intersectsSprite(x)){k&&Oe.setFromMatrixPosition(x.matrixWorld).applyMatrix4(Z);let ue=O.update(x),xe=x.material;xe.visible&&m.push(x,ue,xe,B,Oe.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||dt.intersectsObject(x))){let ue=O.update(x),xe=x.material;if(k&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),Oe.copy(x.boundingSphere.center)):(ue.boundingSphere===null&&ue.computeBoundingSphere(),Oe.copy(ue.boundingSphere.center)),Oe.applyMatrix4(x.matrixWorld).applyMatrix4(Z)),Array.isArray(xe)){let fe=ue.groups;for(let Ue=0,Fe=fe.length;Ue<Fe;Ue++){let Ce=fe[Ue],je=xe[Ce.materialIndex];je&&je.visible&&m.push(x,ue,je,B,Oe.z,Ce)}}else xe.visible&&m.push(x,ue,xe,B,Oe.z,null)}}let ne=x.children;for(let ue=0,xe=ne.length;ue<xe;ue++)_s(ne[ue],N,B,k)}function So(x,N,B,k){let U=x.opaque,ne=x.transmissive,ue=x.transparent;p.setupLightsView(B),Je===!0&&Q.setGlobalState(y.clippingPlanes,B),k&&ve.viewport(P.copy(k)),U.length>0&&dr(U,N,B),ne.length>0&&dr(ne,N,B),ue.length>0&&dr(ue,N,B),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function To(x,N,B,k){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[k.id]===void 0&&(p.state.transmissionRenderTarget[k.id]=new mn(1,1,{generateMipmaps:!0,type:ke.has("EXT_color_buffer_half_float")||ke.has("EXT_color_buffer_float")?Xr:ln,minFilter:Ln,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ze.workingColorSpace}));let ne=p.state.transmissionRenderTarget[k.id],ue=k.viewport||P;ne.setSize(ue.z*y.transmissionResolutionScale,ue.w*y.transmissionResolutionScale);let xe=y.getRenderTarget(),fe=y.getActiveCubeFace(),Ue=y.getActiveMipmapLevel();y.setRenderTarget(ne),y.getClearColor(X),j=y.getClearAlpha(),j<1&&y.setClearColor(16777215,.5),y.clear(),Xe&&be.render(B);let Fe=y.toneMapping;y.toneMapping=mi;let Ce=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),p.setupLightsView(k),Je===!0&&Q.setGlobalState(y.clippingPlanes,k),dr(x,B,k),ze.updateMultisampleRenderTarget(ne),ze.updateRenderTargetMipmap(ne),ke.has("WEBGL_multisampled_render_to_texture")===!1){let je=!1;for(let at=0,bt=N.length;at<bt;at++){let gt=N[at],mt=gt.object,Ie=gt.geometry,vt=gt.material,Qe=gt.group;if(vt.side===Yt&&mt.layers.test(k.layers)){let tn=vt.side;vt.side=Ot,vt.needsUpdate=!0,fr(mt,B,k,Ie,vt,Qe),vt.side=tn,vt.needsUpdate=!0,je=!0}}je===!0&&(ze.updateMultisampleRenderTarget(ne),ze.updateRenderTargetMipmap(ne))}y.setRenderTarget(xe,fe,Ue),y.setClearColor(X,j),Ce!==void 0&&(k.viewport=Ce),y.toneMapping=Fe}function dr(x,N,B){let k=N.isScene===!0?N.overrideMaterial:null;for(let U=0,ne=x.length;U<ne;U++){let ue=x[U],xe=ue.object,fe=ue.geometry,Ue=ue.group,Fe=ue.material;Fe.allowOverride===!0&&k!==null&&(Fe=k),xe.layers.test(B.layers)&&fr(xe,N,B,fe,Fe,Ue)}}function fr(x,N,B,k,U,ne){x.onBeforeRender(y,N,B,k,U,ne),x.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),U.onBeforeRender(y,N,B,k,x,ne),U.transparent===!0&&U.side===Yt&&U.forceSinglePass===!1?(U.side=Ot,U.needsUpdate=!0,y.renderBufferDirect(B,N,k,U,x,ne),U.side=In,U.needsUpdate=!0,y.renderBufferDirect(B,N,k,U,x,ne),U.side=Yt):y.renderBufferDirect(B,N,k,U,x,ne),x.onAfterRender(y,N,B,k,U,ne)}function Di(x,N,B){N.isScene!==!0&&(N=Te);let k=ye.get(x),U=p.state.lights,ne=p.state.shadowsArray,ue=U.state.version,xe=W.getParameters(x,U.state,ne,N,B),fe=W.getProgramCacheKey(xe),Ue=k.programs;k.environment=x.isMeshStandardMaterial?N.environment:null,k.fog=N.fog,k.envMap=(x.isMeshStandardMaterial?Et:St).get(x.envMap||k.environment),k.envMapRotation=k.environment!==null&&x.envMap===null?N.environmentRotation:x.envMapRotation,Ue===void 0&&(x.addEventListener("dispose",Y),Ue=new Map,k.programs=Ue);let Fe=Ue.get(fe);if(Fe!==void 0){if(k.currentProgram===Fe&&k.lightsStateVersion===ue)return Ao(x,xe),Fe}else xe.uniforms=W.getUniforms(x),x.onBeforeCompile(xe,y),Fe=W.acquireProgram(xe,fe),Ue.set(fe,Fe),k.uniforms=xe.uniforms;let Ce=k.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Ce.clippingPlanes=Q.uniform),Ao(x,xe),k.needsLights=Ro(x),k.lightsStateVersion=ue,k.needsLights&&(Ce.ambientLightColor.value=U.state.ambient,Ce.lightProbe.value=U.state.probe,Ce.directionalLights.value=U.state.directional,Ce.directionalLightShadows.value=U.state.directionalShadow,Ce.spotLights.value=U.state.spot,Ce.spotLightShadows.value=U.state.spotShadow,Ce.rectAreaLights.value=U.state.rectArea,Ce.ltc_1.value=U.state.rectAreaLTC1,Ce.ltc_2.value=U.state.rectAreaLTC2,Ce.pointLights.value=U.state.point,Ce.pointLightShadows.value=U.state.pointShadow,Ce.hemisphereLights.value=U.state.hemi,Ce.directionalShadowMap.value=U.state.directionalShadowMap,Ce.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Ce.spotShadowMap.value=U.state.spotShadowMap,Ce.spotLightMatrix.value=U.state.spotLightMatrix,Ce.spotLightMap.value=U.state.spotLightMap,Ce.pointShadowMap.value=U.state.pointShadowMap,Ce.pointShadowMatrix.value=U.state.pointShadowMatrix),k.currentProgram=Fe,k.uniformsList=null,Fe}function wo(x){if(x.uniformsList===null){let N=x.currentProgram.getUniforms();x.uniformsList=Jr.seqWithValue(N.seq,x.uniforms)}return x.uniformsList}function Ao(x,N){let B=ye.get(x);B.outputColorSpace=N.outputColorSpace,B.batching=N.batching,B.batchingColor=N.batchingColor,B.instancing=N.instancing,B.instancingColor=N.instancingColor,B.instancingMorph=N.instancingMorph,B.skinning=N.skinning,B.morphTargets=N.morphTargets,B.morphNormals=N.morphNormals,B.morphColors=N.morphColors,B.morphTargetsCount=N.morphTargetsCount,B.numClippingPlanes=N.numClippingPlanes,B.numIntersection=N.numClipIntersection,B.vertexAlphas=N.vertexAlphas,B.vertexTangents=N.vertexTangents,B.toneMapping=N.toneMapping}function Sh(x,N,B,k,U){N.isScene!==!0&&(N=Te),ze.resetTextureUnits();let ne=N.fog,ue=k.isMeshStandardMaterial?N.environment:null,xe=L===null?y.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Ut,fe=(k.isMeshStandardMaterial?Et:St).get(k.envMap||ue),Ue=k.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Fe=!!B.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Ce=!!B.morphAttributes.position,je=!!B.morphAttributes.normal,at=!!B.morphAttributes.color,bt=mi;k.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(bt=y.toneMapping);let gt=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,mt=gt!==void 0?gt.length:0,Ie=ye.get(k),vt=p.state.lights;if(Je===!0&&(q===!0||x!==M)){let zt=x===M&&k.id===E;Q.setState(k,x,zt)}let Qe=!1;k.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==vt.state.version||Ie.outputColorSpace!==xe||U.isBatchedMesh&&Ie.batching===!1||!U.isBatchedMesh&&Ie.batching===!0||U.isBatchedMesh&&Ie.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Ie.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Ie.instancing===!1||!U.isInstancedMesh&&Ie.instancing===!0||U.isSkinnedMesh&&Ie.skinning===!1||!U.isSkinnedMesh&&Ie.skinning===!0||U.isInstancedMesh&&Ie.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Ie.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Ie.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Ie.instancingMorph===!1&&U.morphTexture!==null||Ie.envMap!==fe||k.fog===!0&&Ie.fog!==ne||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==Q.numPlanes||Ie.numIntersection!==Q.numIntersection)||Ie.vertexAlphas!==Ue||Ie.vertexTangents!==Fe||Ie.morphTargets!==Ce||Ie.morphNormals!==je||Ie.morphColors!==at||Ie.toneMapping!==bt||Ie.morphTargetsCount!==mt)&&(Qe=!0):(Qe=!0,Ie.__version=k.version);let tn=Ie.currentProgram;Qe===!0&&(tn=Di(k,N,U));let mr=!1,nn=!1,vs=!1,yt=tn.getUniforms(),dn=Ie.uniforms;if(ve.useProgram(tn.program)&&(mr=!0,nn=!0,vs=!0),k.id!==E&&(E=k.id,nn=!0),mr||M!==x){ve.buffers.depth.getReversed()&&x.reversedDepth!==!0&&(x._reversedDepth=!0,x.updateProjectionMatrix()),yt.setValue(I,"projectionMatrix",x.projectionMatrix),yt.setValue(I,"viewMatrix",x.matrixWorldInverse);let $t=yt.map.cameraPosition;$t!==void 0&&$t.setValue(I,pe.setFromMatrixPosition(x.matrixWorld)),De.logarithmicDepthBuffer&&yt.setValue(I,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&yt.setValue(I,"isOrthographic",x.isOrthographicCamera===!0),M!==x&&(M=x,nn=!0,vs=!0)}if(U.isSkinnedMesh){yt.setOptional(I,U,"bindMatrix"),yt.setOptional(I,U,"bindMatrixInverse");let zt=U.skeleton;zt&&(zt.boneTexture===null&&zt.computeBoneTexture(),yt.setValue(I,"boneTexture",zt.boneTexture,ze))}U.isBatchedMesh&&(yt.setOptional(I,U,"batchingTexture"),yt.setValue(I,"batchingTexture",U._matricesTexture,ze),yt.setOptional(I,U,"batchingIdTexture"),yt.setValue(I,"batchingIdTexture",U._indirectTexture,ze),yt.setOptional(I,U,"batchingColorTexture"),U._colorsTexture!==null&&yt.setValue(I,"batchingColorTexture",U._colorsTexture,ze));let fn=B.morphAttributes;if((fn.position!==void 0||fn.normal!==void 0||fn.color!==void 0)&&ee.update(U,B,tn),(nn||Ie.receiveShadow!==U.receiveShadow)&&(Ie.receiveShadow=U.receiveShadow,yt.setValue(I,"receiveShadow",U.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(dn.envMap.value=fe,dn.flipEnvMap.value=fe.isCubeTexture&&fe.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&N.environment!==null&&(dn.envMapIntensity.value=N.environmentIntensity),nn&&(yt.setValue(I,"toneMappingExposure",y.toneMappingExposure),Ie.needsLights&&Vl(dn,vs),ne&&k.fog===!0&&$.refreshFogUniforms(dn,ne),$.refreshMaterialUniforms(dn,k,H,K,p.state.transmissionRenderTarget[x.id]),Jr.upload(I,wo(Ie),dn,ze)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Jr.upload(I,wo(Ie),dn,ze),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&yt.setValue(I,"center",U.center),yt.setValue(I,"modelViewMatrix",U.modelViewMatrix),yt.setValue(I,"normalMatrix",U.normalMatrix),yt.setValue(I,"modelMatrix",U.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){let zt=k.uniformsGroups;for(let $t=0,Wl=zt.length;$t<Wl;$t++){let Ni=zt[$t];Ve.update(Ni,tn),Ve.bind(Ni,tn)}}return tn}function Vl(x,N){x.ambientLightColor.needsUpdate=N,x.lightProbe.needsUpdate=N,x.directionalLights.needsUpdate=N,x.directionalLightShadows.needsUpdate=N,x.pointLights.needsUpdate=N,x.pointLightShadows.needsUpdate=N,x.spotLights.needsUpdate=N,x.spotLightShadows.needsUpdate=N,x.rectAreaLights.needsUpdate=N,x.hemisphereLights.needsUpdate=N}function Ro(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(x,N,B){let k=ye.get(x);k.__autoAllocateDepthBuffer=x.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),ye.get(x.texture).__webglTexture=N,ye.get(x.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:B,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(x,N){let B=ye.get(x);B.__webglFramebuffer=N,B.__useDefaultFramebuffer=N===void 0};let zl=I.createFramebuffer();this.setRenderTarget=function(x,N=0,B=0){L=x,w=N,C=B;let k=!0,U=null,ne=!1,ue=!1;if(x){let fe=ye.get(x);if(fe.__useDefaultFramebuffer!==void 0)ve.bindFramebuffer(I.FRAMEBUFFER,null),k=!1;else if(fe.__webglFramebuffer===void 0)ze.setupRenderTarget(x);else if(fe.__hasExternalTextures)ze.rebindTextures(x,ye.get(x.texture).__webglTexture,ye.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){let Ce=x.depthTexture;if(fe.__boundDepthTexture!==Ce){if(Ce!==null&&ye.has(Ce)&&(x.width!==Ce.image.width||x.height!==Ce.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ze.setupDepthRenderbuffer(x)}}let Ue=x.texture;(Ue.isData3DTexture||Ue.isDataArrayTexture||Ue.isCompressedArrayTexture)&&(ue=!0);let Fe=ye.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(Fe[N])?U=Fe[N][B]:U=Fe[N],ne=!0):x.samples>0&&ze.useMultisampledRTT(x)===!1?U=ye.get(x).__webglMultisampledFramebuffer:Array.isArray(Fe)?U=Fe[B]:U=Fe,P.copy(x.viewport),F.copy(x.scissor),V=x.scissorTest}else P.copy(Ae).multiplyScalar(H).floor(),F.copy(Ge).multiplyScalar(H).floor(),V=rt;if(B!==0&&(U=zl),ve.bindFramebuffer(I.FRAMEBUFFER,U)&&k&&ve.drawBuffers(x,U),ve.viewport(P),ve.scissor(F),ve.setScissorTest(V),ne){let fe=ye.get(x.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+N,fe.__webglTexture,B)}else if(ue){let fe=N;for(let Ue=0;Ue<x.textures.length;Ue++){let Fe=ye.get(x.textures[Ue]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Ue,Fe.__webglTexture,B,fe)}}else if(x!==null&&B!==0){let fe=ye.get(x.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,fe.__webglTexture,B)}E=-1},this.readRenderTargetPixels=function(x,N,B,k,U,ne,ue,xe=0){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let fe=ye.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&ue!==void 0&&(fe=fe[ue]),fe){ve.bindFramebuffer(I.FRAMEBUFFER,fe);try{let Ue=x.textures[xe],Fe=Ue.format,Ce=Ue.type;if(!De.textureFormatReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!De.textureTypeReadable(Ce)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=x.width-k&&B>=0&&B<=x.height-U&&(x.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+xe),I.readPixels(N,B,k,U,Se.convert(Fe),Se.convert(Ce),ne))}finally{let Ue=L!==null?ye.get(L).__webglFramebuffer:null;ve.bindFramebuffer(I.FRAMEBUFFER,Ue)}}},this.readRenderTargetPixelsAsync=async function(x,N,B,k,U,ne,ue,xe=0){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let fe=ye.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&ue!==void 0&&(fe=fe[ue]),fe)if(N>=0&&N<=x.width-k&&B>=0&&B<=x.height-U){ve.bindFramebuffer(I.FRAMEBUFFER,fe);let Ue=x.textures[xe],Fe=Ue.format,Ce=Ue.type;if(!De.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!De.textureTypeReadable(Ce))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let je=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,je),I.bufferData(I.PIXEL_PACK_BUFFER,ne.byteLength,I.STREAM_READ),x.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+xe),I.readPixels(N,B,k,U,Se.convert(Fe),Se.convert(Ce),0);let at=L!==null?ye.get(L).__webglFramebuffer:null;ve.bindFramebuffer(I.FRAMEBUFFER,at);let bt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Jd(I,bt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,je),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ne),I.deleteBuffer(je),I.deleteSync(bt),ne}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(x,N=null,B=0){let k=Math.pow(2,-B),U=Math.floor(x.image.width*k),ne=Math.floor(x.image.height*k),ue=N!==null?N.x:0,xe=N!==null?N.y:0;ze.setTexture2D(x,0),I.copyTexSubImage2D(I.TEXTURE_2D,B,0,0,ue,xe,U,ne),ve.unbindTexture()};let Gl=I.createFramebuffer(),pr=I.createFramebuffer();this.copyTextureToTexture=function(x,N,B=null,k=null,U=0,ne=null){ne===null&&(U!==0?(Nr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ne=U,U=0):ne=0);let ue,xe,fe,Ue,Fe,Ce,je,at,bt,gt=x.isCompressedTexture?x.mipmaps[ne]:x.image;if(B!==null)ue=B.max.x-B.min.x,xe=B.max.y-B.min.y,fe=B.isBox3?B.max.z-B.min.z:1,Ue=B.min.x,Fe=B.min.y,Ce=B.isBox3?B.min.z:0;else{let fn=Math.pow(2,-U);ue=Math.floor(gt.width*fn),xe=Math.floor(gt.height*fn),x.isDataArrayTexture?fe=gt.depth:x.isData3DTexture?fe=Math.floor(gt.depth*fn):fe=1,Ue=0,Fe=0,Ce=0}k!==null?(je=k.x,at=k.y,bt=k.z):(je=0,at=0,bt=0);let mt=Se.convert(N.format),Ie=Se.convert(N.type),vt;N.isData3DTexture?(ze.setTexture3D(N,0),vt=I.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(ze.setTexture2DArray(N,0),vt=I.TEXTURE_2D_ARRAY):(ze.setTexture2D(N,0),vt=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,N.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,N.unpackAlignment);let Qe=I.getParameter(I.UNPACK_ROW_LENGTH),tn=I.getParameter(I.UNPACK_IMAGE_HEIGHT),mr=I.getParameter(I.UNPACK_SKIP_PIXELS),nn=I.getParameter(I.UNPACK_SKIP_ROWS),vs=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,gt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,gt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ue),I.pixelStorei(I.UNPACK_SKIP_ROWS,Fe),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ce);let yt=x.isDataArrayTexture||x.isData3DTexture,dn=N.isDataArrayTexture||N.isData3DTexture;if(x.isDepthTexture){let fn=ye.get(x),zt=ye.get(N),$t=ye.get(fn.__renderTarget),Wl=ye.get(zt.__renderTarget);ve.bindFramebuffer(I.READ_FRAMEBUFFER,$t.__webglFramebuffer),ve.bindFramebuffer(I.DRAW_FRAMEBUFFER,Wl.__webglFramebuffer);for(let Ni=0;Ni<fe;Ni++)yt&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ye.get(x).__webglTexture,U,Ce+Ni),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ye.get(N).__webglTexture,ne,bt+Ni)),I.blitFramebuffer(Ue,Fe,ue,xe,je,at,ue,xe,I.DEPTH_BUFFER_BIT,I.NEAREST);ve.bindFramebuffer(I.READ_FRAMEBUFFER,null),ve.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(U!==0||x.isRenderTargetTexture||ye.has(x)){let fn=ye.get(x),zt=ye.get(N);ve.bindFramebuffer(I.READ_FRAMEBUFFER,Gl),ve.bindFramebuffer(I.DRAW_FRAMEBUFFER,pr);for(let $t=0;$t<fe;$t++)yt?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,fn.__webglTexture,U,Ce+$t):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,fn.__webglTexture,U),dn?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,zt.__webglTexture,ne,bt+$t):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,zt.__webglTexture,ne),U!==0?I.blitFramebuffer(Ue,Fe,ue,xe,je,at,ue,xe,I.COLOR_BUFFER_BIT,I.NEAREST):dn?I.copyTexSubImage3D(vt,ne,je,at,bt+$t,Ue,Fe,ue,xe):I.copyTexSubImage2D(vt,ne,je,at,Ue,Fe,ue,xe);ve.bindFramebuffer(I.READ_FRAMEBUFFER,null),ve.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else dn?x.isDataTexture||x.isData3DTexture?I.texSubImage3D(vt,ne,je,at,bt,ue,xe,fe,mt,Ie,gt.data):N.isCompressedArrayTexture?I.compressedTexSubImage3D(vt,ne,je,at,bt,ue,xe,fe,mt,gt.data):I.texSubImage3D(vt,ne,je,at,bt,ue,xe,fe,mt,Ie,gt):x.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,ne,je,at,ue,xe,mt,Ie,gt.data):x.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,ne,je,at,gt.width,gt.height,mt,gt.data):I.texSubImage2D(I.TEXTURE_2D,ne,je,at,ue,xe,mt,Ie,gt);I.pixelStorei(I.UNPACK_ROW_LENGTH,Qe),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,tn),I.pixelStorei(I.UNPACK_SKIP_PIXELS,mr),I.pixelStorei(I.UNPACK_SKIP_ROWS,nn),I.pixelStorei(I.UNPACK_SKIP_IMAGES,vs),ne===0&&N.generateMipmaps&&I.generateMipmap(vt),ve.unbindTexture()},this.initRenderTarget=function(x){ye.get(x).__webglFramebuffer===void 0&&ze.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?ze.setTextureCube(x,0):x.isData3DTexture?ze.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?ze.setTexture2DArray(x,0):ze.setTexture2D(x,0),ve.unbindTexture()},this.resetState=function(){w=0,C=0,L=null,ve.reset(),le.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ze._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ze._getUnpackColorSpace()}};function hu(i,e){if(e===Hc)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===jr||e===lo){let t=i.getIndex();if(t===null){let o=[],a=i.getAttribute("position");if(a!==void 0){for(let l=0;l<a.count;l++)o.push(l);i.setIndex(o),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,r=[];if(e===jr)for(let o=1;o<=n;o++)r.push(t.getX(0)),r.push(t.getX(o)),r.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(r.push(t.getX(o)),r.push(t.getX(o+1)),r.push(t.getX(o+2))):(r.push(t.getX(o+2)),r.push(t.getX(o+1)),r.push(t.getX(o)));r.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let s=i.clone();return s.setIndex(r),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}var ts=class extends kn{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new vu(t)}),this.register(function(t){return new yu(t)}),this.register(function(t){return new Ru(t)}),this.register(function(t){return new Cu(t)}),this.register(function(t){return new Pu(t)}),this.register(function(t){return new Mu(t)}),this.register(function(t){return new Eu(t)}),this.register(function(t){return new bu(t)}),this.register(function(t){return new Su(t)}),this.register(function(t){return new _u(t)}),this.register(function(t){return new Tu(t)}),this.register(function(t){return new xu(t)}),this.register(function(t){return new Au(t)}),this.register(function(t){return new wu(t)}),this.register(function(t){return new mu(t)}),this.register(function(t){return new Iu(t)}),this.register(function(t){return new Lu(t)})}load(e,t,n,r){let s=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let c=di.extractUrlBase(e);o=di.resolveURL(c,this.path)}else o=di.extractUrlBase(e);this.manager.itemStart(e);let a=function(c){r?r(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new Vr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,o,function(u){t(u),s.manager.itemEnd(e)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let s,o={},a={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Nf){try{o[Ye.KHR_BINARY_GLTF]=new Du(e)}catch(h){r&&r(h);return}s=JSON.parse(o[Ye.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){r&&r(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new Hu(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let h=this.pluginCallbacks[u](c);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[h.name]=h,o[h.name]=!0}if(s.extensionsUsed)for(let u=0;u<s.extensionsUsed.length;++u){let h=s.extensionsUsed[u],d=s.extensionsRequired||[];switch(h){case Ye.KHR_MATERIALS_UNLIT:o[h]=new gu;break;case Ye.KHR_DRACO_MESH_COMPRESSION:o[h]=new Nu(s,this.dracoLoader);break;case Ye.KHR_TEXTURE_TRANSFORM:o[h]=new Uu;break;case Ye.KHR_MESH_QUANTIZATION:o[h]=new Ou;break;default:d.indexOf(h)>=0&&a[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,r)}parseAsync(e,t){let n=this;return new Promise(function(r,s){n.parse(e,t,r,s)})}};function T0(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}var Ye={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},mu=class{constructor(e){this.parser=e,this.name=Ye.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){let s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,r=t.cache.get(n);if(r)return r;let s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],c,u=new he(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],Ut);let h=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Ji(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Ks(u),c.distance=h;break;case"spot":c=new Js(u),c.distance=h,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),zn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),r=Promise.resolve(c),t.cache.add(n,r),r}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,s=n.json.nodes[e],a=(s.extensions&&s.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return n._getNodeRef(t.cache,a,l)})}},gu=class{constructor(){this.name=Ye.KHR_MATERIALS_UNLIT}getMaterialType(){return Kt}extendParams(e,t,n){let r=[];e.color=new he(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let o=s.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Ut),e.opacity=o[3]}s.baseColorTexture!==void 0&&r.push(n.assignTexture(e,"map",s.baseColorTexture,Tt))}return Promise.all(r)}},_u=class{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let s=r.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}},vu=class{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Qt}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let s=[],o=r.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(s.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){let a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Le(a,a)}return Promise.all(s)}},yu=class{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_DISPERSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Qt}extendMaterialParams(e,t){let r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let s=r.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}},xu=class{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Qt}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let s=[],o=r.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(s)}},Mu=class{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_SHEEN}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Qt}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let s=[];t.sheenColor=new he(0,0,0),t.sheenRoughness=0,t.sheen=1;let o=r.extensions[this.name];if(o.sheenColorFactor!==void 0){let a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],Ut)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&s.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,Tt)),o.sheenRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(s)}},Eu=class{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Qt}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let s=[],o=r.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&s.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(s)}},bu=class{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_VOLUME}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Qt}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let s=[],o=r.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&s.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;let a=o.attenuationColor||[1,1,1];return t.attenuationColor=new he().setRGB(a[0],a[1],a[2],Ut),Promise.all(s)}},Su=class{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_IOR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Qt}extendMaterialParams(e,t){let r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let s=r.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}},Tu=class{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_SPECULAR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Qt}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let s=[],o=r.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&s.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));let a=o.specularColorFactor||[1,1,1];return t.specularColor=new he().setRGB(a[0],a[1],a[2],Ut),o.specularColorTexture!==void 0&&s.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,Tt)),Promise.all(s)}},wu=class{constructor(e){this.parser=e,this.name=Ye.EXT_MATERIALS_BUMP}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Qt}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let s=[],o=r.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&s.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(s)}},Au=class{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Qt}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let s=[],o=r.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&s.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(s)}},Ru=class{constructor(e){this.parser=e,this.name=Ye.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;let s=r.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,o)}},Cu=class{constructor(e){this.parser=e,this.name=Ye.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,r=n.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;let o=s.extensions[t],a=r.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},Pu=class{constructor(e){this.parser=e,this.name=Ye.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,r=n.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;let o=s.extensions[t],a=r.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},Iu=class{constructor(e){this.name=Ye.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let r=n.extensions[this.name],s=this.parser.getDependency("buffer",r.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(a){let l=r.byteOffset||0,c=r.byteLength||0,u=r.count,h=r.byteStride,d=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,h,d,r.mode,r.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(u*h);return o.decodeGltfBuffer(new Uint8Array(f),u,h,d,r.mode,r.filter),f})})}else return null}},Lu=class{constructor(e){this.name=Ye.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let r=t.meshes[n.mesh];for(let c of r.primitives)if(c.mode!==xn.TRIANGLES&&c.mode!==xn.TRIANGLE_STRIP&&c.mode!==xn.TRIANGLE_FAN&&c.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],l={};for(let c in o)a.push(this.parser.getDependency("accessor",o[c]).then(u=>(l[c]=u,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{let u=c.pop(),h=u.isGroup?u.children:[u],d=c[0].count,f=[];for(let g of h){let _=new Me,m=new S,p=new ie,T=new S(1,1,1),b=new Hs(g.geometry,g.material,d);for(let y=0;y<d;y++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,y),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,y),l.SCALE&&T.fromBufferAttribute(l.SCALE,y),b.setMatrixAt(y,_.compose(m,p,T));for(let y in l)if(y==="_COLOR_0"){let A=l[y];b.instanceColor=new wi(A.array,A.itemSize,A.normalized)}else y!=="TRANSLATION"&&y!=="ROTATION"&&y!=="SCALE"&&g.geometry.setAttribute(y,l[y]);$e.prototype.copy.call(b,g),this.parser.assignFinalMaterial(b),f.push(b)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}},Nf="glTF",ho=12,Pf={JSON:1313821514,BIN:5130562},Du=class{constructor(e){this.name=Ye.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,ho),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Nf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let r=this.header.length-ho,s=new DataView(e,ho),o=0;for(;o<r;){let a=s.getUint32(o,!0);o+=4;let l=s.getUint32(o,!0);if(o+=4,l===Pf.JSON){let c=new Uint8Array(e,ho+o,a);this.content=n.decode(c)}else if(l===Pf.BIN){let c=ho+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Nu=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ye.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,r=this.dracoLoader,s=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(let u in o){let h=Bu[u]||u.toLowerCase();a[h]=o[u]}for(let u in e.attributes){let h=Bu[u]||u.toLowerCase();if(o[u]!==void 0){let d=n.accessors[e.attributes[u]],f=es[d.componentType];c[h]=f.name,l[h]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(u){return new Promise(function(h,d){r.decodeDracoFile(u,function(f){for(let g in f.attributes){let _=f.attributes[g],m=l[g];m!==void 0&&(_.normalized=m)}h(f)},a,c,Ut,d)})})}},Uu=class{constructor(){this.name=Ye.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},Ou=class{constructor(){this.name=Ye.KHR_MESH_QUANTIZATION}},xl=class extends li{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r*3+r;for(let o=0;o!==r;o++)t[o]=n[s+o];return t}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,u=r-t,h=(n-t)/u,d=h*h,f=d*h,g=e*c,_=g-c,m=-2*f+3*d,p=f-d,T=1-m,b=p-d+h;for(let y=0;y!==a;y++){let A=o[_+y+a],w=o[_+y+l]*u,C=o[g+y+a],L=o[g+y]*u;s[y]=T*A+b*w+m*C+p*L}return s}},w0=new ie,Fu=class extends xl{interpolate_(e,t,n,r){let s=super.interpolate_(e,t,n,r);return w0.fromArray(s).normalize().toArray(s),s}},xn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},es={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},If={9728:Nt,9729:Xt,9984:Ra,9985:Gr,9986:er,9987:Ln},Lf={33071:Un,33648:Ir,10497:Ti},du={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Bu={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ri={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},A0={CUBICSPLINE:void 0,LINEAR:Xi,STEP:Wi},fu={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function R0(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new ji({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:In})),i.DefaultMaterial}function or(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function zn(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function C0(i,e,t){let n=!1,r=!1,s=!1;for(let c=0,u=e.length;c<u;c++){let h=e[c];if(h.POSITION!==void 0&&(n=!0),h.NORMAL!==void 0&&(r=!0),h.COLOR_0!==void 0&&(s=!0),n&&r&&s)break}if(!n&&!r&&!s)return Promise.resolve(i);let o=[],a=[],l=[];for(let c=0,u=e.length;c<u;c++){let h=e[c];if(n){let d=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):i.attributes.position;o.push(d)}if(r){let d=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):i.attributes.normal;a.push(d)}if(s){let d=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):i.attributes.color;l.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){let u=c[0],h=c[1],d=c[2];return n&&(i.morphAttributes.position=u),r&&(i.morphAttributes.normal=h),s&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function P0(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,r=t.length;n<r;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function I0(i){let e,t=i.extensions&&i.extensions[Ye.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+pu(t.attributes):e=i.indices+":"+pu(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,r=i.targets.length;n<r;n++)e+=":"+pu(i.targets[n]);return e}function pu(i){let e="",t=Object.keys(i).sort();for(let n=0,r=t.length;n<r;n++)e+=t[n]+":"+i[t[n]]+";";return e}function ku(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function L0(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var D0=new Me,Hu=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new T0,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=-1,s=!1,o=-1;if(typeof navigator<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let l=a.match(/Version\/(\d+)/);r=n&&l?parseInt(l[1],10):-1,s=a.indexOf("Firefox")>-1,o=s?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&r<17||s&&o<98?this.textureLoader=new js(this.options.manager):this.textureLoader=new Qs(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Vr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,r=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][r.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:r.asset,parser:n,userData:{}};return or(s,a,r),zn(a,r),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(let l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let r=0,s=t.length;r<s;r++){let o=t[r].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let r=0,s=e.length;r<s;r++){let o=e[r];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let r=n.clone(),s=(o,a)=>{let l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(let[c,u]of o.children.entries())s(u,a.children[c])};return s(n,r),r.name+="_instance_"+e.uses[t]++,r}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let r=e(t[n]);if(r)return r}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let r=0;r<t.length;r++){let s=e(t[r]);s&&n.push(s)}return n}getDependency(e,t){let n=e+":"+t,r=this.cache.get(n);if(!r){switch(e){case"scene":r=this.loadScene(t);break;case"node":r=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":r=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":r=this.loadAccessor(t);break;case"bufferView":r=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":r=this.loadBuffer(t);break;case"material":r=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":r=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":r=this.loadSkin(t);break;case"animation":r=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!r)throw new Error("Unknown type: "+e);break}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,r=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(r.map(function(s,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ye.KHR_BINARY_GLTF].body);let r=this.options;return new Promise(function(s,o){n.load(di.resolveURL(t.uri,r.path),s,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let r=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+r)})}loadAccessor(e){let t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){let o=du[r.type],a=es[r.componentType],l=r.normalized===!0,c=new a(r.count*o);return Promise.resolve(new Be(c,o,l))}let s=[];return r.bufferView!==void 0?s.push(this.getDependency("bufferView",r.bufferView)):s.push(null),r.sparse!==void 0&&(s.push(this.getDependency("bufferView",r.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",r.sparse.values.bufferView))),Promise.all(s).then(function(o){let a=o[0],l=du[r.type],c=es[r.componentType],u=c.BYTES_PER_ELEMENT,h=u*l,d=r.byteOffset||0,f=r.bufferView!==void 0?n.bufferViews[r.bufferView].byteStride:void 0,g=r.normalized===!0,_,m;if(f&&f!==h){let p=Math.floor(d/f),T="InterleavedBuffer:"+r.bufferView+":"+r.componentType+":"+p+":"+r.count,b=t.cache.get(T);b||(_=new c(a,p*f,r.count*f/u),b=new ri(_,f/u),t.cache.add(T,b)),m=new si(b,l,d%f/u,g)}else a===null?_=new c(r.count*l):_=new c(a,d,r.count*l),m=new Be(_,l,g);if(r.sparse!==void 0){let p=du.SCALAR,T=es[r.sparse.indices.componentType],b=r.sparse.indices.byteOffset||0,y=r.sparse.values.byteOffset||0,A=new T(o[1],b,r.sparse.count*p),w=new c(o[2],y,r.sparse.count*l);a!==null&&(m=new Be(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let C=0,L=A.length;C<L;C++){let E=A[C];if(m.setX(E,w[C*l]),l>=2&&m.setY(E,w[C*l+1]),l>=3&&m.setZ(E,w[C*l+2]),l>=4&&m.setW(E,w[C*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){let t=this.json,n=this.options,s=t.textures[e].source,o=t.images[s],a=this.textureLoader;if(o.uri){let l=n.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,s,a)}loadTextureImage(e,t,n){let r=this,s=this.json,o=s.textures[e],a=s.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);let d=(s.samplers||{})[o.sampler]||{};return u.magFilter=If[d.magFilter]||Xt,u.minFilter=If[d.minFilter]||Ln,u.wrapS=Lf[d.wrapS]||Ti,u.wrapT=Lf[d.wrapT]||Ti,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Nt&&u.minFilter!==Xt,r.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,r=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());let o=r.images[e],a=self.URL||self.webkitURL,l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=n.getDependency("bufferView",o.bufferView).then(function(h){c=!0;let d=new Blob([h],{type:o.mimeType});return l=a.createObjectURL(d),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let u=Promise.resolve(l).then(function(h){return new Promise(function(d,f){let g=d;t.isImageBitmapLoader===!0&&(g=function(_){let m=new wt(_);m.needsUpdate=!0,d(m)}),t.load(di.resolveURL(h,s.path),g,void 0,f)})}).then(function(h){return c===!0&&a.revokeObjectURL(l),zn(h,o),h.userData.mimeType=o.mimeType||L0(o.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),h});return this.sourceCache[e]=u,u}assignTexture(e,t,n,r){let s=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),s.extensions[Ye.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[Ye.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let l=s.associations.get(o);o=s.extensions[Ye.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),s.associations.set(o,l)}}return r!==void 0&&(o.colorSpace=r),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,r=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new Hr,Ht.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(a,l)),n=l}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new qt,Ht.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(a,l)),n=l}if(r||s||o){let a="ClonedMaterial:"+n.uuid+":";r&&(a+="derivative-tangents:"),s&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=n.clone(),s&&(l.vertexColors=!0),o&&(l.flatShading=!0),r&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return ji}loadMaterial(e){let t=this,n=this.json,r=this.extensions,s=n.materials[e],o,a={},l=s.extensions||{},c=[];if(l[Ye.KHR_MATERIALS_UNLIT]){let h=r[Ye.KHR_MATERIALS_UNLIT];o=h.getMaterialType(),c.push(h.extendParams(a,s,t))}else{let h=s.pbrMetallicRoughness||{};if(a.color=new he(1,1,1),a.opacity=1,Array.isArray(h.baseColorFactor)){let d=h.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],Ut),a.opacity=d[3]}h.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",h.baseColorTexture,Tt)),a.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,a.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",h.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",h.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}s.doubleSided===!0&&(a.side=Yt);let u=s.alphaMode||fu.OPAQUE;if(u===fu.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===fu.MASK&&(a.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&o!==Kt&&(c.push(t.assignTexture(a,"normalMap",s.normalTexture)),a.normalScale=new Le(1,1),s.normalTexture.scale!==void 0)){let h=s.normalTexture.scale;a.normalScale.set(h,h)}if(s.occlusionTexture!==void 0&&o!==Kt&&(c.push(t.assignTexture(a,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&o!==Kt){let h=s.emissiveFactor;a.emissive=new he().setRGB(h[0],h[1],h[2],Ut)}return s.emissiveTexture!==void 0&&o!==Kt&&c.push(t.assignTexture(a,"emissiveMap",s.emissiveTexture,Tt)),Promise.all(c).then(function(){let h=new o(a);return s.name&&(h.name=s.name),zn(h,s),t.associations.set(h,{materials:e}),s.extensions&&or(r,h,s),h})}createUniqueName(e){let t=lt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,r=this.primitiveCache;function s(a){return n[Ye.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return Df(l,a,t)})}let o=[];for(let a=0,l=e.length;a<l;a++){let c=e[a],u=I0(c),h=r[u];if(h)o.push(h.promise);else{let d;c.extensions&&c.extensions[Ye.KHR_DRACO_MESH_COMPRESSION]?d=s(c):d=Df(new tt,c,t),r[u]={primitive:c,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,r=this.extensions,s=n.meshes[e],o=s.primitives,a=[];for(let l=0,c=o.length;l<c;l++){let u=o[l].material===void 0?R0(this.cache):this.getDependency("material",o[l].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(l){let c=l.slice(0,l.length-1),u=l[l.length-1],h=[];for(let f=0,g=u.length;f<g;f++){let _=u[f],m=o[f],p,T=c[f];if(m.mode===xn.TRIANGLES||m.mode===xn.TRIANGLE_STRIP||m.mode===xn.TRIANGLE_FAN||m.mode===void 0)p=s.isSkinnedMesh===!0?new oi(_,T):new Mt(_,T),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===xn.TRIANGLE_STRIP?p.geometry=hu(p.geometry,lo):m.mode===xn.TRIANGLE_FAN&&(p.geometry=hu(p.geometry,jr));else if(m.mode===xn.LINES)p=new gn(_,T);else if(m.mode===xn.LINE_STRIP)p=new ai(_,T);else if(m.mode===xn.LINE_LOOP)p=new Vs(_,T);else if(m.mode===xn.POINTS)p=new zs(_,T);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&P0(p,s),p.name=t.createUniqueName(s.name||"mesh_"+e),zn(p,s),m.extensions&&or(r,p,m),t.assignFinalMaterial(p),h.push(p)}for(let f=0,g=h.length;f<g;f++)t.associations.set(h[f],{meshes:e,primitives:f});if(h.length===1)return s.extensions&&or(r,h[0],s),h[0];let d=new _t;s.extensions&&or(r,d,s),t.associations.set(d,{meshes:e});for(let f=0,g=h.length;f<g;f++)d.add(h[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],r=n[n.type];if(!r){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Rt(Ne.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type==="orthographic"&&(t=new $i(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),zn(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let r=0,s=t.joints.length;r<s;r++)n.push(this._loadNodeShallow(t.joints[r]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(r){let s=r.pop(),o=r,a=[],l=[];for(let c=0,u=o.length;c<u;c++){let h=o[c];if(h){a.push(h);let d=new Me;s!==null&&d.fromArray(s.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new an(a,l)})}loadAnimation(e){let t=this.json,n=this,r=t.animations[e],s=r.name?r.name:"animation_"+e,o=[],a=[],l=[],c=[],u=[];for(let h=0,d=r.channels.length;h<d;h++){let f=r.channels[h],g=r.samplers[f.sampler],_=f.target,m=_.node,p=r.parameters!==void 0?r.parameters[g.input]:g.input,T=r.parameters!==void 0?r.parameters[g.output]:g.output;_.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",T)),c.push(g),u.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(h){let d=h[0],f=h[1],g=h[2],_=h[3],m=h[4],p=[];for(let b=0,y=d.length;b<y;b++){let A=d[b],w=f[b],C=g[b],L=_[b],E=m[b];if(A===void 0)continue;A.updateMatrix&&A.updateMatrix();let M=n._createAnimationTracks(A,w,C,L,E);if(M)for(let P=0;P<M.length;P++)p.push(M[P])}let T=new hi(s,void 0,p);return zn(T,r),T})}createNodeMesh(e){let t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency("mesh",r.mesh).then(function(s){let o=n._getNodeRef(n.meshCache,r.mesh,s);return r.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=r.weights.length;l<c;l++)a.morphTargetInfluences[l]=r.weights[l]}),o})}loadNode(e){let t=this.json,n=this,r=t.nodes[e],s=n._loadNodeShallow(e),o=[],a=r.children||[];for(let c=0,u=a.length;c<u;c++)o.push(n.getDependency("node",a[c]));let l=r.skin===void 0?Promise.resolve(null):n.getDependency("skin",r.skin);return Promise.all([s,Promise.all(o),l]).then(function(c){let u=c[0],h=c[1],d=c[2];d!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(d,D0)});for(let f=0,g=h.length;f<g;f++)u.add(h[f]);return u})}_loadNodeShallow(e){let t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],o=s.name?r.createUniqueName(s.name):"",a=[],l=r._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),s.camera!==void 0&&a.push(r.getDependency("camera",s.camera).then(function(c){return r._getNodeRef(r.cameraCache,s.camera,c)})),r._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let u;if(s.isBone===!0?u=new Br:c.length>1?u=new _t:c.length===1?u=c[0]:u=new $e,u!==c[0])for(let h=0,d=c.length;h<d;h++)u.add(c[h]);if(s.name&&(u.userData.name=s.name,u.name=o),zn(u,s),s.extensions&&or(n,u,s),s.matrix!==void 0){let h=new Me;h.fromArray(s.matrix),u.applyMatrix4(h)}else s.translation!==void 0&&u.position.fromArray(s.translation),s.rotation!==void 0&&u.quaternion.fromArray(s.rotation),s.scale!==void 0&&u.scale.fromArray(s.scale);if(!r.associations.has(u))r.associations.set(u,{});else if(s.mesh!==void 0&&r.meshCache.refs[s.mesh]>1){let h=r.associations.get(u);r.associations.set(u,{...h})}return r.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],r=this,s=new _t;n.name&&(s.name=r.createUniqueName(n.name)),zn(s,n),n.extensions&&or(t,s,n);let o=n.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(r.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let u=0,h=l.length;u<h;u++)s.add(l[u]);let c=u=>{let h=new Map;for(let[d,f]of r.associations)(d instanceof Ht||d instanceof wt)&&h.set(d,f);return u.traverse(d=>{let f=r.associations.get(d);f!=null&&h.set(d,f)}),h};return r.associations=c(s),s})}_createAnimationTracks(e,t,n,r,s){let o=[],a=e.name?e.name:e.uuid,l=[];Ri[s.path]===Ri.weights?e.traverse(function(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}):l.push(a);let c;switch(Ri[s.path]){case Ri.weights:c=_n;break;case Ri.rotation:c=vn;break;case Ri.translation:case Ri.scale:c=Bn;break;default:n.itemSize===1?c=_n:c=Bn;break}let u=r.interpolation!==void 0?A0[r.interpolation]:Xi,h=this._getArrayFromAccessor(n);for(let d=0,f=l.length;d<f;d++){let g=new c(l[d]+"."+Ri[s.path],t.array,h,u);r.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),o.push(g)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=ku(t.constructor),r=new Float32Array(t.length);for(let s=0,o=t.length;s<o;s++)r[s]=t[s]*n;t=r}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let r=this instanceof vn?Fu:xl;return new r(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function N0(i,e,t){let n=e.attributes,r=new kt;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(r.set(new S(l[0],l[1],l[2]),new S(c[0],c[1],c[2])),a.normalized){let u=ku(es[a.componentType]);r.min.multiplyScalar(u),r.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let a=new S,l=new S;for(let c=0,u=s.length;c<u;c++){let h=s[c];if(h.POSITION!==void 0){let d=t.json.accessors[h.POSITION],f=d.min,g=d.max;if(f!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),d.normalized){let _=ku(es[d.componentType]);l.multiplyScalar(_)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}r.expandByVector(a)}i.boundingBox=r;let o=new Jt;r.getCenter(o.center),o.radius=r.min.distanceTo(r.max)/2,i.boundingSphere=o}function Df(i,e,t){let n=e.attributes,r=[];function s(o,a){return t.getDependency("accessor",o).then(function(l){i.setAttribute(a,l)})}for(let o in n){let a=Bu[o]||o.toLowerCase();a in i.attributes||r.push(s(n[o],a))}if(e.indices!==void 0&&!i.index){let o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});r.push(o)}return Ze.workingColorSpace!==Ut&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ze.workingColorSpace}" not supported.`),zn(i,e),N0(i,e,t),Promise.all(r).then(function(){return e.targets!==void 0?C0(i,e.targets,t):i})}var Ml=(i,e,t)=>new Promise((n,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?n(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(i,e)).next())}),nt=(i,e,t)=>new Promise((n,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?n(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(i,e)).next())}),Uf=class extends $e{constructor(i){super(),this.weight=0,this.isBinary=!1,this.overrideBlink="none",this.overrideLookAt="none",this.overrideMouth="none",this._binds=[],this.name=`VRMExpression_${i}`,this.expressionName=i,this.type="VRMExpression",this.visible=!1}get binds(){return this._binds}get overrideBlinkAmount(){return this.overrideBlink==="block"?0<this.outputWeight?1:0:this.overrideBlink==="blend"?this.outputWeight:0}get overrideLookAtAmount(){return this.overrideLookAt==="block"?0<this.outputWeight?1:0:this.overrideLookAt==="blend"?this.outputWeight:0}get overrideMouthAmount(){return this.overrideMouth==="block"?0<this.outputWeight?1:0:this.overrideMouth==="blend"?this.outputWeight:0}get outputWeight(){return this.isBinary?this.weight>.5?1:0:this.weight}addBind(i){this._binds.push(i)}deleteBind(i){let e=this._binds.indexOf(i);e>=0&&this._binds.splice(e,1)}applyWeight(i){var e;let t=this.outputWeight;t*=(e=i?.multiplier)!=null?e:1,this.isBinary&&t<1&&(t=0),this._binds.forEach(n=>n.applyWeight(t))}clearAppliedWeight(){this._binds.forEach(i=>i.clearAppliedWeight())}};function _p(i,e,t){var n,r;let s=i.parser.json,o=(n=s.nodes)==null?void 0:n[e];if(o==null)return console.warn(`extractPrimitivesInternal: Attempt to use nodes[${e}] of glTF but the node doesn't exist`),null;let a=o.mesh;if(a==null)return null;let l=(r=s.meshes)==null?void 0:r[a];if(l==null)return console.warn(`extractPrimitivesInternal: Attempt to use meshes[${a}] of glTF but the mesh doesn't exist`),null;let c=l.primitives.length,u=[];return t.traverse(h=>{u.length<c&&h.isMesh&&u.push(h)}),u}function Of(i,e){return nt(this,null,function*(){let t=yield i.parser.getDependency("node",e);return _p(i,e,t)})}function Ff(i){return nt(this,null,function*(){let e=yield i.parser.getDependencies("node"),t=new Map;return e.forEach((n,r)=>{let s=_p(i,r,n);s!=null&&t.set(r,s)}),t})}var Qu={Aa:"aa",Ih:"ih",Ou:"ou",Ee:"ee",Oh:"oh",Blink:"blink",Happy:"happy",Angry:"angry",Sad:"sad",Relaxed:"relaxed",LookUp:"lookUp",Surprised:"surprised",LookDown:"lookDown",LookLeft:"lookLeft",LookRight:"lookRight",BlinkLeft:"blinkLeft",BlinkRight:"blinkRight",Neutral:"neutral"};function vp(i){return Math.max(Math.min(i,1),0)}var Bf=class yp{constructor(){this.blinkExpressionNames=["blink","blinkLeft","blinkRight"],this.lookAtExpressionNames=["lookLeft","lookRight","lookUp","lookDown"],this.mouthExpressionNames=["aa","ee","ih","oh","ou"],this._expressions=[],this._expressionMap={}}get expressions(){return this._expressions.concat()}get expressionMap(){return Object.assign({},this._expressionMap)}get presetExpressionMap(){let e={},t=new Set(Object.values(Qu));return Object.entries(this._expressionMap).forEach(([n,r])=>{t.has(n)&&(e[n]=r)}),e}get customExpressionMap(){let e={},t=new Set(Object.values(Qu));return Object.entries(this._expressionMap).forEach(([n,r])=>{t.has(n)||(e[n]=r)}),e}copy(e){return this._expressions.concat().forEach(n=>{this.unregisterExpression(n)}),e._expressions.forEach(n=>{this.registerExpression(n)}),this.blinkExpressionNames=e.blinkExpressionNames.concat(),this.lookAtExpressionNames=e.lookAtExpressionNames.concat(),this.mouthExpressionNames=e.mouthExpressionNames.concat(),this}clone(){return new yp().copy(this)}getExpression(e){var t;return(t=this._expressionMap[e])!=null?t:null}registerExpression(e){this._expressions.push(e),this._expressionMap[e.expressionName]=e}unregisterExpression(e){let t=this._expressions.indexOf(e);t===-1&&console.warn("VRMExpressionManager: The specified expressions is not registered"),this._expressions.splice(t,1),delete this._expressionMap[e.expressionName]}getValue(e){var t;let n=this.getExpression(e);return(t=n?.weight)!=null?t:null}setValue(e,t){let n=this.getExpression(e);n&&(n.weight=vp(t))}resetValues(){this._expressions.forEach(e=>{e.weight=0})}getExpressionTrackName(e){let t=this.getExpression(e);return t?`${t.name}.weight`:null}update(){let e=this._calculateWeightMultipliers();this._expressions.forEach(t=>{t.clearAppliedWeight()}),this._expressions.forEach(t=>{let n=1,r=t.expressionName;this.blinkExpressionNames.indexOf(r)!==-1&&(n*=e.blink),this.lookAtExpressionNames.indexOf(r)!==-1&&(n*=e.lookAt),this.mouthExpressionNames.indexOf(r)!==-1&&(n*=e.mouth),t.applyWeight({multiplier:n})})}_calculateWeightMultipliers(){let e=1,t=1,n=1;return this._expressions.forEach(r=>{e-=r.overrideBlinkAmount,t-=r.overrideLookAtAmount,n-=r.overrideMouthAmount}),e=Math.max(0,e),t=Math.max(0,t),n=Math.max(0,n),{blink:e,lookAt:t,mouth:n}}},fo={Color:"color",EmissionColor:"emissionColor",ShadeColor:"shadeColor",MatcapColor:"matcapColor",RimColor:"rimColor",OutlineColor:"outlineColor"},U0={_Color:fo.Color,_EmissionColor:fo.EmissionColor,_ShadeColor:fo.ShadeColor,_RimColor:fo.RimColor,_OutlineColor:fo.OutlineColor},O0=new he,xp=class Mp{constructor({material:e,type:t,targetValue:n,targetAlpha:r}){this.material=e,this.type=t,this.targetValue=n,this.targetAlpha=r??1;let s=this._initColorBindState(),o=this._initAlphaBindState();this._state={color:s,alpha:o}}applyWeight(e){let{color:t,alpha:n}=this._state;if(t!=null){let{propertyName:r,deltaValue:s}=t,o=this.material[r];o?.add(O0.copy(s).multiplyScalar(e))}if(n!=null){let{propertyName:r,deltaValue:s}=n;this.material[r]!=null&&(this.material[r]+=s*e)}}clearAppliedWeight(){let{color:e,alpha:t}=this._state;if(e!=null){let{propertyName:n,initialValue:r}=e,s=this.material[n];s?.copy(r)}if(t!=null){let{propertyName:n,initialValue:r}=t;this.material[n]!=null&&(this.material[n]=r)}}_initColorBindState(){var e,t,n;let{material:r,type:s,targetValue:o}=this,a=this._getPropertyNameMap(),l=(t=(e=a?.[s])==null?void 0:e[0])!=null?t:null;if(l==null)return console.warn(`Tried to add a material color bind to the material ${(n=r.name)!=null?n:"(no name)"}, the type ${s} but the material or the type is not supported.`),null;let u=r[l].clone(),h=new he(o.r-u.r,o.g-u.g,o.b-u.b);return{propertyName:l,initialValue:u,deltaValue:h}}_initAlphaBindState(){var e,t,n;let{material:r,type:s,targetAlpha:o}=this,a=this._getPropertyNameMap(),l=(t=(e=a?.[s])==null?void 0:e[1])!=null?t:null;if(l==null&&o!==1)return console.warn(`Tried to add a material alpha bind to the material ${(n=r.name)!=null?n:"(no name)"}, the type ${s} but the material or the type does not support alpha.`),null;if(l==null)return null;let c=r[l],u=o-c;return{propertyName:l,initialValue:c,deltaValue:u}}_getPropertyNameMap(){var e,t;return(t=(e=Object.entries(Mp._propertyNameMapMap).find(([n])=>this.material[n]===!0))==null?void 0:e[1])!=null?t:null}};xp._propertyNameMapMap={isMeshStandardMaterial:{color:["color","opacity"],emissionColor:["emissive",null]},isMeshBasicMaterial:{color:["color","opacity"]},isMToonMaterial:{color:["color","opacity"],emissionColor:["emissive",null],outlineColor:["outlineColorFactor",null],matcapColor:["matcapFactor",null],rimColor:["parametricRimColorFactor",null],shadeColor:["shadeColorFactor",null]}};var kf=xp,Rl=class{constructor({primitives:i,index:e,weight:t}){this.primitives=i,this.index=e,this.weight=t}applyWeight(i){this.primitives.forEach(e=>{var t;((t=e.morphTargetInfluences)==null?void 0:t[this.index])!=null&&(e.morphTargetInfluences[this.index]+=this.weight*i)})}clearAppliedWeight(){this.primitives.forEach(i=>{var e;((e=i.morphTargetInfluences)==null?void 0:e[this.index])!=null&&(i.morphTargetInfluences[this.index]=0)})}},Hf=new Le,Ep=class bp{constructor({material:e,scale:t,offset:n}){var r,s;this.material=e,this.scale=t,this.offset=n;let o=(r=Object.entries(bp._propertyNamesMap).find(([a])=>e[a]===!0))==null?void 0:r[1];o==null?(console.warn(`Tried to add a texture transform bind to the material ${(s=e.name)!=null?s:"(no name)"} but the material is not supported.`),this._properties=[]):(this._properties=[],o.forEach(a=>{var l;let c=(l=e[a])==null?void 0:l.clone();if(!c)return null;e[a]=c;let u=c.offset.clone(),h=c.repeat.clone(),d=n.clone().sub(u),f=t.clone().sub(h);this._properties.push({name:a,initialOffset:u,deltaOffset:d,initialScale:h,deltaScale:f})}))}applyWeight(e){this._properties.forEach(t=>{let n=this.material[t.name];n!==void 0&&(n.offset.add(Hf.copy(t.deltaOffset).multiplyScalar(e)),n.repeat.add(Hf.copy(t.deltaScale).multiplyScalar(e)))})}clearAppliedWeight(){this._properties.forEach(e=>{let t=this.material[e.name];t!==void 0&&(t.offset.copy(e.initialOffset),t.repeat.copy(e.initialScale))})}};Ep._propertyNamesMap={isMeshStandardMaterial:["map","emissiveMap","bumpMap","normalMap","displacementMap","roughnessMap","metalnessMap","alphaMap"],isMeshBasicMaterial:["map","specularMap","alphaMap"],isMToonMaterial:["map","normalMap","emissiveMap","shadeMultiplyTexture","rimMultiplyTexture","outlineWidthMultiplyTexture","uvAnimationMaskTexture"]};var Vf=Ep,F0=new Set(["1.0","1.0-beta"]),Sp=class Tp{get name(){return"VRMExpressionLoaderPlugin"}constructor(e){this.parser=e}afterRoot(e){return nt(this,null,function*(){e.userData.vrmExpressionManager=yield this._import(e)})}_import(e){return nt(this,null,function*(){let t=yield this._v1Import(e);if(t)return t;let n=yield this._v0Import(e);return n||null})}_v1Import(e){return nt(this,null,function*(){var t,n;let r=this.parser.json;if(!(((t=r.extensionsUsed)==null?void 0:t.indexOf("VRMC_vrm"))!==-1))return null;let o=(n=r.extensions)==null?void 0:n.VRMC_vrm;if(!o)return null;let a=o.specVersion;if(!F0.has(a))return console.warn(`VRMExpressionLoaderPlugin: Unknown VRMC_vrm specVersion "${a}"`),null;let l=o.expressions;if(!l)return null;let c=new Set(Object.values(Qu)),u=new Map;l.preset!=null&&Object.entries(l.preset).forEach(([d,f])=>{if(f!=null){if(!c.has(d)){console.warn(`VRMExpressionLoaderPlugin: Unknown preset name "${d}" detected. Ignoring the expression`);return}u.set(d,f)}}),l.custom!=null&&Object.entries(l.custom).forEach(([d,f])=>{if(c.has(d)){console.warn(`VRMExpressionLoaderPlugin: Custom expression cannot have preset name "${d}". Ignoring the expression`);return}u.set(d,f)});let h=new Bf;return yield Promise.all(Array.from(u.entries()).map(d=>nt(this,[d],function*([f,g]){var _,m,p,T,b,y,A;let w=new Uf(f);if(e.scene.add(w),w.isBinary=(_=g.isBinary)!=null?_:!1,w.overrideBlink=(m=g.overrideBlink)!=null?m:"none",w.overrideLookAt=(p=g.overrideLookAt)!=null?p:"none",w.overrideMouth=(T=g.overrideMouth)!=null?T:"none",(b=g.morphTargetBinds)==null||b.forEach(C=>nt(this,null,function*(){var L;if(C.node===void 0||C.index===void 0)return;let E=yield Of(e,C.node),M=C.index;if(!E.every(P=>Array.isArray(P.morphTargetInfluences)&&M<P.morphTargetInfluences.length)){console.warn(`VRMExpressionLoaderPlugin: ${g.name} attempts to index morph #${M} but not found.`);return}w.addBind(new Rl({primitives:E,index:M,weight:(L=C.weight)!=null?L:1}))})),g.materialColorBinds||g.textureTransformBinds){let C=[];e.scene.traverse(L=>{let E=L.material;E&&(Array.isArray(E)?C.push(...E):C.push(E))}),(y=g.materialColorBinds)==null||y.forEach(L=>nt(this,null,function*(){C.filter(M=>{var P;let F=(P=this.parser.associations.get(M))==null?void 0:P.materials;return L.material===F}).forEach(M=>{w.addBind(new kf({material:M,type:L.type,targetValue:new he().fromArray(L.targetValue),targetAlpha:L.targetValue[3]}))})})),(A=g.textureTransformBinds)==null||A.forEach(L=>nt(this,null,function*(){C.filter(M=>{var P;let F=(P=this.parser.associations.get(M))==null?void 0:P.materials;return L.material===F}).forEach(M=>{var P,F;w.addBind(new Vf({material:M,offset:new Le().fromArray((P=L.offset)!=null?P:[0,0]),scale:new Le().fromArray((F=L.scale)!=null?F:[1,1])}))})}))}h.registerExpression(w)}))),h})}_v0Import(e){return nt(this,null,function*(){var t;let n=this.parser.json,r=(t=n.extensions)==null?void 0:t.VRM;if(!r)return null;let s=r.blendShapeMaster;if(!s)return null;let o=new Bf,a=s.blendShapeGroups;if(!a)return o;let l=new Set;return yield Promise.all(a.map(c=>nt(this,null,function*(){var u;let h=c.presetName,d=h!=null&&Tp.v0v1PresetNameMap[h]||null,f=d??c.name;if(f==null){console.warn("VRMExpressionLoaderPlugin: One of custom expressions has no name. Ignoring the expression");return}if(l.has(f)){console.warn(`VRMExpressionLoaderPlugin: An expression preset ${h} has duplicated entries. Ignoring the expression`);return}l.add(f);let g=new Uf(f);e.scene.add(g),g.isBinary=(u=c.isBinary)!=null?u:!1,c.binds&&c.binds.forEach(m=>nt(this,null,function*(){var p;if(m.mesh===void 0||m.index===void 0)return;let T=[];if((p=n.nodes)==null||p.forEach((y,A)=>{y.mesh===m.mesh&&T.push(A)}),T.length===0){console.warn(`VRMExpressionLoaderPlugin: ${c.name} attempts to bind a morph target to the mesh #${m.mesh} but the mesh is not found or not used in the scene. Ignoring the bind.`);return}let b=m.index;yield Promise.all(T.map(y=>nt(this,null,function*(){var A;let w=yield Of(e,y);if(!w.every(C=>Array.isArray(C.morphTargetInfluences)&&b<C.morphTargetInfluences.length)){console.warn(`VRMExpressionLoaderPlugin: ${c.name} attempts to index ${b}th morph but not found.`);return}g.addBind(new Rl({primitives:w,index:b,weight:.01*((A=m.weight)!=null?A:100)}))})))}));let _=c.materialValues;_&&_.length!==0&&_.forEach(m=>{if(m.materialName===void 0||m.propertyName===void 0||m.targetValue===void 0)return;let p=[];e.scene.traverse(b=>{if(b.material){let y=b.material;Array.isArray(y)?p.push(...y.filter(A=>(A.name===m.materialName||A.name===m.materialName+" (Outline)")&&p.indexOf(A)===-1)):y.name===m.materialName&&p.indexOf(y)===-1&&p.push(y)}});let T=m.propertyName;p.forEach(b=>{if(T==="_MainTex_ST"){let A=new Le(m.targetValue[0],m.targetValue[1]),w=new Le(m.targetValue[2],m.targetValue[3]);w.y=1-w.y-A.y,g.addBind(new Vf({material:b,scale:A,offset:w}));return}let y=U0[T];if(y){g.addBind(new kf({material:b,type:y,targetValue:new he().fromArray(m.targetValue),targetAlpha:m.targetValue[3]}));return}console.warn(T+" is not supported")})}),o.registerExpression(g)}))),o})}};Sp.v0v1PresetNameMap={a:"aa",e:"ee",i:"ih",o:"oh",u:"ou",blink:"blink",joy:"happy",angry:"angry",sorrow:"sad",fun:"relaxed",lookup:"lookUp",lookdown:"lookDown",lookleft:"lookLeft",lookright:"lookRight",blink_l:"blinkLeft",blink_r:"blinkRight",neutral:"neutral"};var B0=Sp;var sh=class ss{constructor(e,t){this._firstPersonOnlyLayer=ss.DEFAULT_FIRSTPERSON_ONLY_LAYER,this._thirdPersonOnlyLayer=ss.DEFAULT_THIRDPERSON_ONLY_LAYER,this._initializedLayers=!1,this.humanoid=e,this.meshAnnotations=t}copy(e){if(this.humanoid!==e.humanoid)throw new Error("VRMFirstPerson: humanoid must be same in order to copy");return this.meshAnnotations=e.meshAnnotations.map(t=>({meshes:t.meshes.concat(),type:t.type})),this}clone(){return new ss(this.humanoid,this.meshAnnotations).copy(this)}get firstPersonOnlyLayer(){return this._firstPersonOnlyLayer}get thirdPersonOnlyLayer(){return this._thirdPersonOnlyLayer}setup({firstPersonOnlyLayer:e=ss.DEFAULT_FIRSTPERSON_ONLY_LAYER,thirdPersonOnlyLayer:t=ss.DEFAULT_THIRDPERSON_ONLY_LAYER}={}){this._initializedLayers||(this._firstPersonOnlyLayer=e,this._thirdPersonOnlyLayer=t,this.meshAnnotations.forEach(n=>{n.meshes.forEach(r=>{n.type==="firstPersonOnly"?(r.layers.set(this._firstPersonOnlyLayer),r.traverse(s=>s.layers.set(this._firstPersonOnlyLayer))):n.type==="thirdPersonOnly"?(r.layers.set(this._thirdPersonOnlyLayer),r.traverse(s=>s.layers.set(this._thirdPersonOnlyLayer))):n.type==="auto"&&this._createHeadlessModel(r)})}),this._initializedLayers=!0)}_excludeTriangles(e,t,n,r){let s=0;if(t!=null&&t.length>0)for(let o=0;o<e.length;o+=3){let a=e[o],l=e[o+1],c=e[o+2],u=t[a],h=n[a];if(u[0]>0&&r.includes(h[0])||u[1]>0&&r.includes(h[1])||u[2]>0&&r.includes(h[2])||u[3]>0&&r.includes(h[3]))continue;let d=t[l],f=n[l];if(d[0]>0&&r.includes(f[0])||d[1]>0&&r.includes(f[1])||d[2]>0&&r.includes(f[2])||d[3]>0&&r.includes(f[3]))continue;let g=t[c],_=n[c];g[0]>0&&r.includes(_[0])||g[1]>0&&r.includes(_[1])||g[2]>0&&r.includes(_[2])||g[3]>0&&r.includes(_[3])||(e[s++]=a,e[s++]=l,e[s++]=c)}return s}_createErasedMesh(e,t){let n=new oi(e.geometry.clone(),e.material);n.name=`${e.name}(erase)`,n.frustumCulled=e.frustumCulled,n.layers.set(this._firstPersonOnlyLayer);let r=n.geometry,s=r.getAttribute("skinIndex"),o=s instanceof fi?[]:s.array,a=[];for(let _=0;_<o.length;_+=4)a.push([o[_],o[_+1],o[_+2],o[_+3]]);let l=r.getAttribute("skinWeight"),c=l instanceof fi?[]:l.array,u=[];for(let _=0;_<c.length;_+=4)u.push([c[_],c[_+1],c[_+2],c[_+3]]);let h=r.getIndex();if(!h)throw new Error("The geometry doesn't have an index buffer");let d=Array.from(h.array),f=this._excludeTriangles(d,u,a,t),g=[];for(let _=0;_<f;_++)g[_]=d[_];return r.setIndex(g),e.onBeforeRender&&(n.onBeforeRender=e.onBeforeRender),n.bind(new an(e.skeleton.bones,e.skeleton.boneInverses),new Me),n}_createHeadlessModelForSkinnedMesh(e,t){let n=[];if(t.skeleton.bones.forEach((s,o)=>{this._isEraseTarget(s)&&n.push(o)}),!n.length){t.layers.enable(this._thirdPersonOnlyLayer),t.layers.enable(this._firstPersonOnlyLayer);return}t.layers.set(this._thirdPersonOnlyLayer);let r=this._createErasedMesh(t,n);e.add(r)}_createHeadlessModel(e){if(e.type==="Group")if(e.layers.set(this._thirdPersonOnlyLayer),this._isEraseTarget(e))e.traverse(t=>t.layers.set(this._thirdPersonOnlyLayer));else{let t=new _t;t.name=`_headless_${e.name}`,t.layers.set(this._firstPersonOnlyLayer),e.parent.add(t),e.children.filter(n=>n.type==="SkinnedMesh").forEach(n=>{let r=n;this._createHeadlessModelForSkinnedMesh(t,r)})}else if(e.type==="SkinnedMesh"){let t=e;this._createHeadlessModelForSkinnedMesh(e.parent,t)}else this._isEraseTarget(e)&&(e.layers.set(this._thirdPersonOnlyLayer),e.traverse(t=>t.layers.set(this._thirdPersonOnlyLayer)))}_isEraseTarget(e){return e===this.humanoid.getRawBoneNode("head")?!0:e.parent?this._isEraseTarget(e.parent):!1}};sh.DEFAULT_FIRSTPERSON_ONLY_LAYER=9;sh.DEFAULT_THIRDPERSON_ONLY_LAYER=10;var zf=sh,k0=new Set(["1.0","1.0-beta"]),H0=class{get name(){return"VRMFirstPersonLoaderPlugin"}constructor(i){this.parser=i}afterRoot(i){return nt(this,null,function*(){let e=i.userData.vrmHumanoid;if(e!==null){if(e===void 0)throw new Error("VRMFirstPersonLoaderPlugin: vrmHumanoid is undefined. VRMHumanoidLoaderPlugin have to be used first");i.userData.vrmFirstPerson=yield this._import(i,e)}})}_import(i,e){return nt(this,null,function*(){if(e==null)return null;let t=yield this._v1Import(i,e);if(t)return t;let n=yield this._v0Import(i,e);return n||null})}_v1Import(i,e){return nt(this,null,function*(){var t,n;let r=this.parser.json;if(!(((t=r.extensionsUsed)==null?void 0:t.indexOf("VRMC_vrm"))!==-1))return null;let o=(n=r.extensions)==null?void 0:n.VRMC_vrm;if(!o)return null;let a=o.specVersion;if(!k0.has(a))return console.warn(`VRMFirstPersonLoaderPlugin: Unknown VRMC_vrm specVersion "${a}"`),null;let l=o.firstPerson,c=[],u=yield Ff(i);return Array.from(u.entries()).forEach(([h,d])=>{var f,g;let _=(f=l?.meshAnnotations)==null?void 0:f.find(m=>m.node===h);c.push({meshes:d,type:(g=_?.type)!=null?g:"auto"})}),new zf(e,c)})}_v0Import(i,e){return nt(this,null,function*(){var t;let n=this.parser.json,r=(t=n.extensions)==null?void 0:t.VRM;if(!r)return null;let s=r.firstPerson;if(!s)return null;let o=[],a=yield Ff(i);return Array.from(a.entries()).forEach(([l,c])=>{let u=n.nodes[l],h=s.meshAnnotations?s.meshAnnotations.find(d=>d.mesh===u.mesh):void 0;o.push({meshes:c,type:this._convertV0FlagToV1Type(h?.firstPersonFlag)})}),new zf(e,o)})}_convertV0FlagToV1Type(i){return i==="FirstPersonOnly"?"firstPersonOnly":i==="ThirdPersonOnly"?"thirdPersonOnly":i==="Both"?"both":"auto"}};var Gf=new S,Wf=new S,V0=new ie,Xf=class extends _t{constructor(i){super(),this.vrmHumanoid=i,this._boneAxesMap=new Map,Object.values(i.humanBones).forEach(e=>{let t=new no(1);t.matrixAutoUpdate=!1,t.material.depthTest=!1,t.material.depthWrite=!1,this.add(t),this._boneAxesMap.set(e,t)})}dispose(){Array.from(this._boneAxesMap.values()).forEach(i=>{i.geometry.dispose(),i.material.dispose()})}updateMatrixWorld(i){Array.from(this._boneAxesMap.entries()).forEach(([e,t])=>{e.node.updateWorldMatrix(!0,!1),e.node.matrixWorld.decompose(Gf,V0,Wf);let n=Gf.set(.1,.1,.1).divide(Wf);t.matrix.copy(e.node.matrixWorld).scale(n)}),super.updateMatrixWorld(i)}},Vu=["hips","spine","chest","upperChest","neck","head","leftEye","rightEye","jaw","leftUpperLeg","leftLowerLeg","leftFoot","leftToes","rightUpperLeg","rightLowerLeg","rightFoot","rightToes","leftShoulder","leftUpperArm","leftLowerArm","leftHand","rightShoulder","rightUpperArm","rightLowerArm","rightHand","leftThumbMetacarpal","leftThumbProximal","leftThumbDistal","leftIndexProximal","leftIndexIntermediate","leftIndexDistal","leftMiddleProximal","leftMiddleIntermediate","leftMiddleDistal","leftRingProximal","leftRingIntermediate","leftRingDistal","leftLittleProximal","leftLittleIntermediate","leftLittleDistal","rightThumbMetacarpal","rightThumbProximal","rightThumbDistal","rightIndexProximal","rightIndexIntermediate","rightIndexDistal","rightMiddleProximal","rightMiddleIntermediate","rightMiddleDistal","rightRingProximal","rightRingIntermediate","rightRingDistal","rightLittleProximal","rightLittleIntermediate","rightLittleDistal"];var z0={hips:null,spine:"hips",chest:"spine",upperChest:"chest",neck:"upperChest",head:"neck",leftEye:"head",rightEye:"head",jaw:"head",leftUpperLeg:"hips",leftLowerLeg:"leftUpperLeg",leftFoot:"leftLowerLeg",leftToes:"leftFoot",rightUpperLeg:"hips",rightLowerLeg:"rightUpperLeg",rightFoot:"rightLowerLeg",rightToes:"rightFoot",leftShoulder:"upperChest",leftUpperArm:"leftShoulder",leftLowerArm:"leftUpperArm",leftHand:"leftLowerArm",rightShoulder:"upperChest",rightUpperArm:"rightShoulder",rightLowerArm:"rightUpperArm",rightHand:"rightLowerArm",leftThumbMetacarpal:"leftHand",leftThumbProximal:"leftThumbMetacarpal",leftThumbDistal:"leftThumbProximal",leftIndexProximal:"leftHand",leftIndexIntermediate:"leftIndexProximal",leftIndexDistal:"leftIndexIntermediate",leftMiddleProximal:"leftHand",leftMiddleIntermediate:"leftMiddleProximal",leftMiddleDistal:"leftMiddleIntermediate",leftRingProximal:"leftHand",leftRingIntermediate:"leftRingProximal",leftRingDistal:"leftRingIntermediate",leftLittleProximal:"leftHand",leftLittleIntermediate:"leftLittleProximal",leftLittleDistal:"leftLittleIntermediate",rightThumbMetacarpal:"rightHand",rightThumbProximal:"rightThumbMetacarpal",rightThumbDistal:"rightThumbProximal",rightIndexProximal:"rightHand",rightIndexIntermediate:"rightIndexProximal",rightIndexDistal:"rightIndexIntermediate",rightMiddleProximal:"rightHand",rightMiddleIntermediate:"rightMiddleProximal",rightMiddleDistal:"rightMiddleIntermediate",rightRingProximal:"rightHand",rightRingIntermediate:"rightRingProximal",rightRingDistal:"rightRingIntermediate",rightLittleProximal:"rightHand",rightLittleIntermediate:"rightLittleProximal",rightLittleDistal:"rightLittleIntermediate"};function wp(i){return i.invert?i.invert():i.inverse(),i}var ar=new S,lr=new ie,eh=class{constructor(i){this.humanBones=i,this.restPose=this.getAbsolutePose()}getAbsolutePose(){let i={};return Object.keys(this.humanBones).forEach(e=>{let t=e,n=this.getBoneNode(t);n&&(ar.copy(n.position),lr.copy(n.quaternion),i[t]={position:ar.toArray(),rotation:lr.toArray()})}),i}getPose(){let i={};return Object.keys(this.humanBones).forEach(e=>{let t=e,n=this.getBoneNode(t);if(!n)return;ar.set(0,0,0),lr.identity();let r=this.restPose[t];r?.position&&ar.fromArray(r.position).negate(),r?.rotation&&wp(lr.fromArray(r.rotation)),ar.add(n.position),lr.premultiply(n.quaternion),i[t]={position:ar.toArray(),rotation:lr.toArray()}}),i}setPose(i){Object.entries(i).forEach(([e,t])=>{let n=e,r=this.getBoneNode(n);if(!r)return;let s=this.restPose[n];s&&(t?.position&&(r.position.fromArray(t.position),s.position&&r.position.add(ar.fromArray(s.position))),t?.rotation&&(r.quaternion.fromArray(t.rotation),s.rotation&&r.quaternion.multiply(lr.fromArray(s.rotation))))})}resetPose(){Object.entries(this.restPose).forEach(([i,e])=>{let t=this.getBoneNode(i);t&&(e?.position&&t.position.fromArray(e.position),e?.rotation&&t.quaternion.fromArray(e.rotation))})}getBone(i){var e;return(e=this.humanBones[i])!=null?e:void 0}getBoneNode(i){var e,t;return(t=(e=this.humanBones[i])==null?void 0:e.node)!=null?t:null}},zu=new S,G0=new ie,W0=new S,qf=class Ap extends eh{static _setupTransforms(e){let t=new $e;t.name="VRMHumanoidRig";let n={},r={},s={},o={};Vu.forEach(l=>{var c;let u=e.getBoneNode(l);if(u){let h=new S,d=new ie;u.updateWorldMatrix(!0,!1),u.matrixWorld.decompose(h,d,zu),n[l]=h,r[l]=d,s[l]=u.quaternion.clone();let f=new ie;(c=u.parent)==null||c.matrixWorld.decompose(zu,f,zu),o[l]=f}});let a={};return Vu.forEach(l=>{var c;let u=e.getBoneNode(l);if(u){let h=n[l],d=l,f;for(;f==null&&(d=z0[d],d!=null);)f=n[d];let g=new $e;g.name="Normalized_"+u.name,(d?(c=a[d])==null?void 0:c.node:t).add(g),g.position.copy(h),f&&g.position.sub(f),a[l]={node:g}}}),{rigBones:a,root:t,parentWorldRotations:o,boneRotations:s}}constructor(e){let{rigBones:t,root:n,parentWorldRotations:r,boneRotations:s}=Ap._setupTransforms(e);super(t),this.original=e,this.root=n,this._parentWorldRotations=r,this._boneRotations=s}update(){Vu.forEach(e=>{let t=this.original.getBoneNode(e);if(t!=null){let n=this.getBoneNode(e),r=this._parentWorldRotations[e],s=G0.copy(r).invert(),o=this._boneRotations[e];if(t.quaternion.copy(n.quaternion).multiply(r).premultiply(s).multiply(o),e==="hips"){let a=n.getWorldPosition(W0);t.parent.updateWorldMatrix(!0,!1);let l=t.parent.matrixWorld,c=a.applyMatrix4(l.invert());t.position.copy(c)}}})}},Yf=class Rp{get restPose(){return console.warn("VRMHumanoid: restPose is deprecated. Use either rawRestPose or normalizedRestPose instead."),this.rawRestPose}get rawRestPose(){return this._rawHumanBones.restPose}get normalizedRestPose(){return this._normalizedHumanBones.restPose}get humanBones(){return this._rawHumanBones.humanBones}get rawHumanBones(){return this._rawHumanBones.humanBones}get normalizedHumanBones(){return this._normalizedHumanBones.humanBones}get normalizedHumanBonesRoot(){return this._normalizedHumanBones.root}constructor(e,t){var n;this.autoUpdateHumanBones=(n=t?.autoUpdateHumanBones)!=null?n:!0,this._rawHumanBones=new eh(e),this._normalizedHumanBones=new qf(this._rawHumanBones)}copy(e){return this.autoUpdateHumanBones=e.autoUpdateHumanBones,this._rawHumanBones=new eh(e.humanBones),this._normalizedHumanBones=new qf(this._rawHumanBones),this}clone(){return new Rp(this.humanBones,{autoUpdateHumanBones:this.autoUpdateHumanBones}).copy(this)}getAbsolutePose(){return console.warn("VRMHumanoid: getAbsolutePose() is deprecated. Use either getRawAbsolutePose() or getNormalizedAbsolutePose() instead."),this.getRawAbsolutePose()}getRawAbsolutePose(){return this._rawHumanBones.getAbsolutePose()}getNormalizedAbsolutePose(){return this._normalizedHumanBones.getAbsolutePose()}getPose(){return console.warn("VRMHumanoid: getPose() is deprecated. Use either getRawPose() or getNormalizedPose() instead."),this.getRawPose()}getRawPose(){return this._rawHumanBones.getPose()}getNormalizedPose(){return this._normalizedHumanBones.getPose()}setPose(e){return console.warn("VRMHumanoid: setPose() is deprecated. Use either setRawPose() or setNormalizedPose() instead."),this.setRawPose(e)}setRawPose(e){return this._rawHumanBones.setPose(e)}setNormalizedPose(e){return this._normalizedHumanBones.setPose(e)}resetPose(){return console.warn("VRMHumanoid: resetPose() is deprecated. Use either resetRawPose() or resetNormalizedPose() instead."),this.resetRawPose()}resetRawPose(){return this._rawHumanBones.resetPose()}resetNormalizedPose(){return this._normalizedHumanBones.resetPose()}getBone(e){return console.warn("VRMHumanoid: getBone() is deprecated. Use either getRawBone() or getNormalizedBone() instead."),this.getRawBone(e)}getRawBone(e){return this._rawHumanBones.getBone(e)}getNormalizedBone(e){return this._normalizedHumanBones.getBone(e)}getBoneNode(e){return console.warn("VRMHumanoid: getBoneNode() is deprecated. Use either getRawBoneNode() or getNormalizedBoneNode() instead."),this.getRawBoneNode(e)}getRawBoneNode(e){return this._rawHumanBones.getBoneNode(e)}getNormalizedBoneNode(e){return this._normalizedHumanBones.getBoneNode(e)}update(){this.autoUpdateHumanBones&&this._normalizedHumanBones.update()}},X0={Hips:"hips",Spine:"spine",Head:"head",LeftUpperLeg:"leftUpperLeg",LeftLowerLeg:"leftLowerLeg",LeftFoot:"leftFoot",RightUpperLeg:"rightUpperLeg",RightLowerLeg:"rightLowerLeg",RightFoot:"rightFoot",LeftUpperArm:"leftUpperArm",LeftLowerArm:"leftLowerArm",LeftHand:"leftHand",RightUpperArm:"rightUpperArm",RightLowerArm:"rightLowerArm",RightHand:"rightHand"},q0=new Set(["1.0","1.0-beta"]),jf={leftThumbProximal:"leftThumbMetacarpal",leftThumbIntermediate:"leftThumbProximal",rightThumbProximal:"rightThumbMetacarpal",rightThumbIntermediate:"rightThumbProximal"},Y0=class{get name(){return"VRMHumanoidLoaderPlugin"}constructor(i,e){this.parser=i,this.helperRoot=e?.helperRoot,this.autoUpdateHumanBones=e?.autoUpdateHumanBones}afterRoot(i){return nt(this,null,function*(){i.userData.vrmHumanoid=yield this._import(i)})}_import(i){return nt(this,null,function*(){let e=yield this._v1Import(i);if(e)return e;let t=yield this._v0Import(i);return t||null})}_v1Import(i){return nt(this,null,function*(){var e,t;let n=this.parser.json;if(!(((e=n.extensionsUsed)==null?void 0:e.indexOf("VRMC_vrm"))!==-1))return null;let s=(t=n.extensions)==null?void 0:t.VRMC_vrm;if(!s)return null;let o=s.specVersion;if(!q0.has(o))return console.warn(`VRMHumanoidLoaderPlugin: Unknown VRMC_vrm specVersion "${o}"`),null;let a=s.humanoid;if(!a)return null;let l=a.humanBones.leftThumbIntermediate!=null||a.humanBones.rightThumbIntermediate!=null,c={};a.humanBones!=null&&(yield Promise.all(Object.entries(a.humanBones).map(h=>nt(this,[h],function*([d,f]){let g=d,_=f.node;if(l){let p=jf[g];p!=null&&(g=p)}let m=yield this.parser.getDependency("node",_);if(m==null){console.warn(`A glTF node bound to the humanoid bone ${g} (index = ${_}) does not exist`);return}c[g]={node:m}}))));let u=new Yf(this._ensureRequiredBonesExist(c),{autoUpdateHumanBones:this.autoUpdateHumanBones});if(i.scene.add(u.normalizedHumanBonesRoot),this.helperRoot){let h=new Xf(u);this.helperRoot.add(h),h.renderOrder=this.helperRoot.renderOrder}return u})}_v0Import(i){return nt(this,null,function*(){var e;let n=(e=this.parser.json.extensions)==null?void 0:e.VRM;if(!n)return null;let r=n.humanoid;if(!r)return null;let s={};r.humanBones!=null&&(yield Promise.all(r.humanBones.map(a=>nt(this,null,function*(){let l=a.bone,c=a.node;if(l==null||c==null)return;if(c<0){console.warn(`A glTF node index for the humanoid bone ${l} is negative (${c}), ignoring this bone.`);return}let u=yield this.parser.getDependency("node",c);if(u==null){console.warn(`A glTF node bound to the humanoid bone ${l} (index = ${c}) does not exist`);return}let h=jf[l],d=h??l;if(s[d]!=null){console.warn(`Multiple bone entries for ${d} detected (index = ${c}), ignoring duplicated entries.`);return}s[d]={node:u}}))));let o=new Yf(this._ensureRequiredBonesExist(s),{autoUpdateHumanBones:this.autoUpdateHumanBones});if(i.scene.add(o.normalizedHumanBonesRoot),this.helperRoot){let a=new Xf(o);this.helperRoot.add(a),a.renderOrder=this.helperRoot.renderOrder}return o})}_ensureRequiredBonesExist(i){let e=Object.values(X0).filter(t=>i[t]==null);if(e.length>0)throw new Error(`VRMHumanoidLoaderPlugin: These humanoid bones are required but not exist: ${e.join(", ")}`);return i}},Zf=class extends tt{constructor(){super(),this._currentTheta=0,this._currentRadius=0,this.theta=0,this.radius=0,this._currentTheta=0,this._currentRadius=0,this._attrPos=new Be(new Float32Array(195),3),this.setAttribute("position",this._attrPos),this._attrIndex=new Be(new Uint16Array(189),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let i=!1;this._currentTheta!==this.theta&&(this._currentTheta=this.theta,i=!0),this._currentRadius!==this.radius&&(this._currentRadius=this.radius,i=!0),i&&this._buildPosition()}_buildPosition(){this._attrPos.setXYZ(0,0,0,0);for(let i=0;i<64;i++){let e=i/63*this._currentTheta;this._attrPos.setXYZ(i+1,this._currentRadius*Math.sin(e),0,this._currentRadius*Math.cos(e))}this._attrPos.needsUpdate=!0}_buildIndex(){for(let i=0;i<63;i++)this._attrIndex.setXYZ(i*3,0,i+1,i+2);this._attrIndex.needsUpdate=!0}},j0=class extends tt{constructor(){super(),this.radius=0,this._currentRadius=0,this.tail=new S,this._currentTail=new S,this._attrPos=new Be(new Float32Array(294),3),this.setAttribute("position",this._attrPos),this._attrIndex=new Be(new Uint16Array(194),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let i=!1;this._currentRadius!==this.radius&&(this._currentRadius=this.radius,i=!0),this._currentTail.equals(this.tail)||(this._currentTail.copy(this.tail),i=!0),i&&this._buildPosition()}_buildPosition(){for(let i=0;i<32;i++){let e=i/16*Math.PI;this._attrPos.setXYZ(i,Math.cos(e),Math.sin(e),0),this._attrPos.setXYZ(32+i,0,Math.cos(e),Math.sin(e)),this._attrPos.setXYZ(64+i,Math.sin(e),0,Math.cos(e))}this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.setXYZ(96,0,0,0),this._attrPos.setXYZ(97,this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let i=0;i<32;i++){let e=(i+1)%32;this._attrIndex.setXY(i*2,i,e),this._attrIndex.setXY(64+i*2,32+i,32+e),this._attrIndex.setXY(128+i*2,64+i,64+e)}this._attrIndex.setXY(192,96,97),this._attrIndex.needsUpdate=!0}},El=new ie,$f=new ie,po=new S,Jf=new S,Kf=Math.sqrt(2)/2,Z0=new ie(0,0,-Kf,Kf),$0=new S(0,1,0),J0=class extends _t{constructor(i){super(),this.matrixAutoUpdate=!1,this.vrmLookAt=i;{let e=new Zf;e.radius=.5;let t=new Kt({color:65280,transparent:!0,opacity:.5,side:Yt,depthTest:!1,depthWrite:!1});this._meshPitch=new Mt(e,t),this.add(this._meshPitch)}{let e=new Zf;e.radius=.5;let t=new Kt({color:16711680,transparent:!0,opacity:.5,side:Yt,depthTest:!1,depthWrite:!1});this._meshYaw=new Mt(e,t),this.add(this._meshYaw)}{let e=new j0;e.radius=.1;let t=new qt({color:16777215,depthTest:!1,depthWrite:!1});this._lineTarget=new gn(e,t),this._lineTarget.frustumCulled=!1,this.add(this._lineTarget)}}dispose(){this._meshYaw.geometry.dispose(),this._meshYaw.material.dispose(),this._meshPitch.geometry.dispose(),this._meshPitch.material.dispose(),this._lineTarget.geometry.dispose(),this._lineTarget.material.dispose()}updateMatrixWorld(i){let e=Ne.DEG2RAD*this.vrmLookAt.yaw;this._meshYaw.geometry.theta=e,this._meshYaw.geometry.update();let t=Ne.DEG2RAD*this.vrmLookAt.pitch;this._meshPitch.geometry.theta=t,this._meshPitch.geometry.update(),this.vrmLookAt.getLookAtWorldPosition(po),this.vrmLookAt.getLookAtWorldQuaternion(El),El.multiply(this.vrmLookAt.getFaceFrontQuaternion($f)),this._meshYaw.position.copy(po),this._meshYaw.quaternion.copy(El),this._meshPitch.position.copy(po),this._meshPitch.quaternion.copy(El),this._meshPitch.quaternion.multiply($f.setFromAxisAngle($0,e)),this._meshPitch.quaternion.multiply(Z0);let{target:n,autoUpdate:r}=this.vrmLookAt;n!=null&&r&&(n.getWorldPosition(Jf).sub(po),this._lineTarget.geometry.tail.copy(Jf),this._lineTarget.geometry.update(),this._lineTarget.position.copy(po)),super.updateMatrixWorld(i)}},K0=new S,Q0=new S;function th(i,e){return i.matrixWorld.decompose(K0,e,Q0),e}function Tl(i){return[Math.atan2(-i.z,i.x),Math.atan2(i.y,Math.sqrt(i.x*i.x+i.z*i.z))]}function Qf(i){let e=Math.round(i/2/Math.PI);return i-2*Math.PI*e}var ep=new S(0,0,1),eM=new S,tM=new S,nM=new S,iM=new ie,Gu=new ie,tp=new ie,rM=new ie,Wu=new xt,Cp=class Pp{constructor(e,t){this.offsetFromHeadBone=new S,this.autoUpdate=!0,this.faceFront=new S(0,0,1),this.humanoid=e,this.applier=t,this._yaw=0,this._pitch=0,this._needsUpdate=!0,this._restHeadWorldQuaternion=this.getLookAtWorldQuaternion(new ie)}get yaw(){return this._yaw}set yaw(e){this._yaw=e,this._needsUpdate=!0}get pitch(){return this._pitch}set pitch(e){this._pitch=e,this._needsUpdate=!0}get euler(){return console.warn("VRMLookAt: euler is deprecated. use getEuler() instead."),this.getEuler(new xt)}getEuler(e){return e.set(Ne.DEG2RAD*this._pitch,Ne.DEG2RAD*this._yaw,0,"YXZ")}copy(e){if(this.humanoid!==e.humanoid)throw new Error("VRMLookAt: humanoid must be same in order to copy");return this.offsetFromHeadBone.copy(e.offsetFromHeadBone),this.applier=e.applier,this.autoUpdate=e.autoUpdate,this.target=e.target,this.faceFront.copy(e.faceFront),this}clone(){return new Pp(this.humanoid,this.applier).copy(this)}reset(){this._yaw=0,this._pitch=0,this._needsUpdate=!0}getLookAtWorldPosition(e){let t=this.humanoid.getRawBoneNode("head");return e.copy(this.offsetFromHeadBone).applyMatrix4(t.matrixWorld)}getLookAtWorldQuaternion(e){let t=this.humanoid.getRawBoneNode("head");return th(t,e)}getFaceFrontQuaternion(e){if(this.faceFront.distanceToSquared(ep)<.01)return e.copy(this._restHeadWorldQuaternion).invert();let[t,n]=Tl(this.faceFront);return Wu.set(0,.5*Math.PI+t,n,"YZX"),e.setFromEuler(Wu).premultiply(rM.copy(this._restHeadWorldQuaternion).invert())}getLookAtWorldDirection(e){return this.getLookAtWorldQuaternion(Gu),this.getFaceFrontQuaternion(tp),e.copy(ep).applyQuaternion(Gu).applyQuaternion(tp).applyEuler(this.getEuler(Wu))}lookAt(e){let t=iM.copy(this._restHeadWorldQuaternion).multiply(wp(this.getLookAtWorldQuaternion(Gu))),n=this.getLookAtWorldPosition(tM),r=nM.copy(e).sub(n).applyQuaternion(t).normalize(),[s,o]=Tl(this.faceFront),[a,l]=Tl(r),c=Qf(a-s),u=Qf(o-l);this._yaw=Ne.RAD2DEG*c,this._pitch=Ne.RAD2DEG*u,this._needsUpdate=!0}update(e){this.target!=null&&this.autoUpdate&&this.lookAt(this.target.getWorldPosition(eM)),this._needsUpdate&&(this._needsUpdate=!1,this.applier.applyYawPitch(this._yaw,this._pitch))}};Cp.EULER_ORDER="YXZ";var sM=Cp,oM=new S(0,0,1),Gn=new ie,ns=new ie,Mn=new xt(0,0,0,"YXZ"),wl=class{constructor(i,e,t,n,r){this.humanoid=i,this.rangeMapHorizontalInner=e,this.rangeMapHorizontalOuter=t,this.rangeMapVerticalDown=n,this.rangeMapVerticalUp=r,this.faceFront=new S(0,0,1),this._restQuatLeftEye=new ie,this._restQuatRightEye=new ie,this._restLeftEyeParentWorldQuat=new ie,this._restRightEyeParentWorldQuat=new ie;let s=this.humanoid.getRawBoneNode("leftEye"),o=this.humanoid.getRawBoneNode("rightEye");s&&(this._restQuatLeftEye.copy(s.quaternion),th(s.parent,this._restLeftEyeParentWorldQuat)),o&&(this._restQuatRightEye.copy(o.quaternion),th(o.parent,this._restRightEyeParentWorldQuat))}applyYawPitch(i,e){let t=this.humanoid.getRawBoneNode("leftEye"),n=this.humanoid.getRawBoneNode("rightEye"),r=this.humanoid.getNormalizedBoneNode("leftEye"),s=this.humanoid.getNormalizedBoneNode("rightEye");t&&(e<0?Mn.x=-Ne.DEG2RAD*this.rangeMapVerticalDown.map(-e):Mn.x=Ne.DEG2RAD*this.rangeMapVerticalUp.map(e),i<0?Mn.y=-Ne.DEG2RAD*this.rangeMapHorizontalInner.map(-i):Mn.y=Ne.DEG2RAD*this.rangeMapHorizontalOuter.map(i),Gn.setFromEuler(Mn),this._getWorldFaceFrontQuat(ns),r.quaternion.copy(ns).multiply(Gn).multiply(ns.invert()),Gn.copy(this._restLeftEyeParentWorldQuat),t.quaternion.copy(r.quaternion).multiply(Gn).premultiply(Gn.invert()).multiply(this._restQuatLeftEye)),n&&(e<0?Mn.x=-Ne.DEG2RAD*this.rangeMapVerticalDown.map(-e):Mn.x=Ne.DEG2RAD*this.rangeMapVerticalUp.map(e),i<0?Mn.y=-Ne.DEG2RAD*this.rangeMapHorizontalOuter.map(-i):Mn.y=Ne.DEG2RAD*this.rangeMapHorizontalInner.map(i),Gn.setFromEuler(Mn),this._getWorldFaceFrontQuat(ns),s.quaternion.copy(ns).multiply(Gn).multiply(ns.invert()),Gn.copy(this._restRightEyeParentWorldQuat),n.quaternion.copy(s.quaternion).multiply(Gn).premultiply(Gn.invert()).multiply(this._restQuatRightEye))}lookAt(i){console.warn("VRMLookAtBoneApplier: lookAt() is deprecated. use apply() instead.");let e=Ne.RAD2DEG*i.y,t=Ne.RAD2DEG*i.x;this.applyYawPitch(e,t)}_getWorldFaceFrontQuat(i){if(this.faceFront.distanceToSquared(oM)<.01)return i.identity();let[e,t]=Tl(this.faceFront);return Mn.set(0,.5*Math.PI+e,t,"YZX"),i.setFromEuler(Mn)}};wl.type="bone";var nh=class{constructor(i,e,t,n,r){this.expressions=i,this.rangeMapHorizontalInner=e,this.rangeMapHorizontalOuter=t,this.rangeMapVerticalDown=n,this.rangeMapVerticalUp=r}applyYawPitch(i,e){e<0?(this.expressions.setValue("lookDown",0),this.expressions.setValue("lookUp",this.rangeMapVerticalUp.map(-e))):(this.expressions.setValue("lookUp",0),this.expressions.setValue("lookDown",this.rangeMapVerticalDown.map(e))),i<0?(this.expressions.setValue("lookLeft",0),this.expressions.setValue("lookRight",this.rangeMapHorizontalOuter.map(-i))):(this.expressions.setValue("lookRight",0),this.expressions.setValue("lookLeft",this.rangeMapHorizontalOuter.map(i)))}lookAt(i){console.warn("VRMLookAtBoneApplier: lookAt() is deprecated. use apply() instead.");let e=Ne.RAD2DEG*i.y,t=Ne.RAD2DEG*i.x;this.applyYawPitch(e,t)}};nh.type="expression";var np=class{constructor(i,e){this.inputMaxValue=i,this.outputScale=e}map(i){return this.outputScale*vp(i/this.inputMaxValue)}},aM=new Set(["1.0","1.0-beta"]),bl=.01,lM=class{get name(){return"VRMLookAtLoaderPlugin"}constructor(i,e){this.parser=i,this.helperRoot=e?.helperRoot}afterRoot(i){return nt(this,null,function*(){let e=i.userData.vrmHumanoid;if(e===null)return;if(e===void 0)throw new Error("VRMLookAtLoaderPlugin: vrmHumanoid is undefined. VRMHumanoidLoaderPlugin have to be used first");let t=i.userData.vrmExpressionManager;if(t!==null){if(t===void 0)throw new Error("VRMLookAtLoaderPlugin: vrmExpressionManager is undefined. VRMExpressionLoaderPlugin have to be used first");i.userData.vrmLookAt=yield this._import(i,e,t)}})}_import(i,e,t){return nt(this,null,function*(){if(e==null||t==null)return null;let n=yield this._v1Import(i,e,t);if(n)return n;let r=yield this._v0Import(i,e,t);return r||null})}_v1Import(i,e,t){return nt(this,null,function*(){var n,r,s;let o=this.parser.json;if(!(((n=o.extensionsUsed)==null?void 0:n.indexOf("VRMC_vrm"))!==-1))return null;let l=(r=o.extensions)==null?void 0:r.VRMC_vrm;if(!l)return null;let c=l.specVersion;if(!aM.has(c))return console.warn(`VRMLookAtLoaderPlugin: Unknown VRMC_vrm specVersion "${c}"`),null;let u=l.lookAt;if(!u)return null;let h=u.type==="expression"?1:10,d=this._v1ImportRangeMap(u.rangeMapHorizontalInner,h),f=this._v1ImportRangeMap(u.rangeMapHorizontalOuter,h),g=this._v1ImportRangeMap(u.rangeMapVerticalDown,h),_=this._v1ImportRangeMap(u.rangeMapVerticalUp,h),m;u.type==="expression"?m=new nh(t,d,f,g,_):m=new wl(e,d,f,g,_);let p=this._importLookAt(e,m);return p.offsetFromHeadBone.fromArray((s=u.offsetFromHeadBone)!=null?s:[0,.06,0]),p})}_v1ImportRangeMap(i,e){var t,n;let r=(t=i?.inputMaxValue)!=null?t:90,s=(n=i?.outputScale)!=null?n:e;return r<bl&&(console.warn("VRMLookAtLoaderPlugin: inputMaxValue of a range map is too small. Consider reviewing the range map!"),r=bl),new np(r,s)}_v0Import(i,e,t){return nt(this,null,function*(){var n,r,s,o;let l=(n=this.parser.json.extensions)==null?void 0:n.VRM;if(!l)return null;let c=l.firstPerson;if(!c)return null;let u=c.lookAtTypeName==="BlendShape"?1:10,h=this._v0ImportDegreeMap(c.lookAtHorizontalInner,u),d=this._v0ImportDegreeMap(c.lookAtHorizontalOuter,u),f=this._v0ImportDegreeMap(c.lookAtVerticalDown,u),g=this._v0ImportDegreeMap(c.lookAtVerticalUp,u),_;c.lookAtTypeName==="BlendShape"?_=new nh(t,h,d,f,g):_=new wl(e,h,d,f,g);let m=this._importLookAt(e,_);return c.firstPersonBoneOffset?m.offsetFromHeadBone.set((r=c.firstPersonBoneOffset.x)!=null?r:0,(s=c.firstPersonBoneOffset.y)!=null?s:.06,-((o=c.firstPersonBoneOffset.z)!=null?o:0)):m.offsetFromHeadBone.set(0,.06,0),m.faceFront.set(0,0,-1),_ instanceof wl&&_.faceFront.set(0,0,-1),m})}_v0ImportDegreeMap(i,e){var t,n;let r=i?.curve;JSON.stringify(r)!=="[0,0,0,1,1,1,1,0]"&&console.warn("Curves of LookAtDegreeMap defined in VRM 0.0 are not supported");let s=(t=i?.xRange)!=null?t:90,o=(n=i?.yRange)!=null?n:e;return s<bl&&(console.warn("VRMLookAtLoaderPlugin: xRange of a degree map is too small. Consider reviewing the degree map!"),s=bl),new np(s,o)}_importLookAt(i,e){let t=new sM(i,e);if(this.helperRoot){let n=new J0(t);this.helperRoot.add(n),n.renderOrder=this.helperRoot.renderOrder}return t}};function cM(i,e){return typeof i!="string"||i===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(i)&&(e=e.replace(/(^https?:\/\/[^/]+).*/i,"$1")),/^(https?:)?\/\//i.test(i)||/^data:.*,.*$/i.test(i)||/^blob:.*$/i.test(i)?i:e+i)}var uM=new Set(["1.0","1.0-beta"]),hM=class{get name(){return"VRMMetaLoaderPlugin"}constructor(i,e){var t,n,r;this.parser=i,this.needThumbnailImage=(t=e?.needThumbnailImage)!=null?t:!1,this.acceptLicenseUrls=(n=e?.acceptLicenseUrls)!=null?n:["https:"+"//vrm.dev/licenses/1.0/"],this.acceptV0Meta=(r=e?.acceptV0Meta)!=null?r:!0}afterRoot(i){return nt(this,null,function*(){i.userData.vrmMeta=yield this._import(i)})}_import(i){return nt(this,null,function*(){let e=yield this._v1Import(i);if(e!=null)return e;let t=yield this._v0Import(i);return t??null})}_v1Import(i){return nt(this,null,function*(){var e,t,n;let r=this.parser.json;if(!(((e=r.extensionsUsed)==null?void 0:e.indexOf("VRMC_vrm"))!==-1))return null;let o=(t=r.extensions)==null?void 0:t.VRMC_vrm;if(o==null)return null;let a=o.specVersion;if(!uM.has(a))return console.warn(`VRMMetaLoaderPlugin: Unknown VRMC_vrm specVersion "${a}"`),null;let l=o.meta;if(!l)return null;let c=l.licenseUrl;if(!new Set(this.acceptLicenseUrls).has(c))throw new Error(`VRMMetaLoaderPlugin: The license url "${c}" is not accepted`);let h;return this.needThumbnailImage&&l.thumbnailImage!=null&&(h=(n=yield this._extractGLTFImage(l.thumbnailImage))!=null?n:void 0),{metaVersion:"1",name:l.name,version:l.version,authors:l.authors,copyrightInformation:l.copyrightInformation,contactInformation:l.contactInformation,references:l.references,thirdPartyLicenses:l.thirdPartyLicenses,thumbnailImage:h,licenseUrl:l.licenseUrl,avatarPermission:l.avatarPermission,allowExcessivelyViolentUsage:l.allowExcessivelyViolentUsage,allowExcessivelySexualUsage:l.allowExcessivelySexualUsage,commercialUsage:l.commercialUsage,allowPoliticalOrReligiousUsage:l.allowPoliticalOrReligiousUsage,allowAntisocialOrHateUsage:l.allowAntisocialOrHateUsage,creditNotation:l.creditNotation,allowRedistribution:l.allowRedistribution,modification:l.modification,otherLicenseUrl:l.otherLicenseUrl}})}_v0Import(i){return nt(this,null,function*(){var e;let n=(e=this.parser.json.extensions)==null?void 0:e.VRM;if(!n)return null;let r=n.meta;if(!r)return null;if(!this.acceptV0Meta)throw new Error("VRMMetaLoaderPlugin: Attempted to load VRM0.0 meta but acceptV0Meta is false");let s;return this.needThumbnailImage&&r.texture!=null&&r.texture!==-1&&(s=yield this.parser.getDependency("texture",r.texture)),{metaVersion:"0",allowedUserName:r.allowedUserName,author:r.author,commercialUssageName:r.commercialUssageName,contactInformation:r.contactInformation,licenseName:r.licenseName,otherLicenseUrl:r.otherLicenseUrl,otherPermissionUrl:r.otherPermissionUrl,reference:r.reference,sexualUssageName:r.sexualUssageName,texture:s??void 0,title:r.title,version:r.version,violentUssageName:r.violentUssageName}})}_extractGLTFImage(i){return nt(this,null,function*(){var e;let n=(e=this.parser.json.images)==null?void 0:e[i];if(n==null)return console.warn(`VRMMetaLoaderPlugin: Attempt to use images[${i}] of glTF as a thumbnail but the image doesn't exist`),null;let r=n.uri;if(n.bufferView!=null){let o=yield this.parser.getDependency("bufferView",n.bufferView),a=new Blob([o],{type:n.mimeType});r=URL.createObjectURL(a)}return r==null?(console.warn(`VRMMetaLoaderPlugin: Attempt to use images[${i}] of glTF as a thumbnail but the image couldn't load properly`),null):yield new zr().loadAsync(cM(r,this.parser.options.path)).catch(o=>(console.error(o),console.warn("VRMMetaLoaderPlugin: Failed to load a thumbnail image"),null))})}},dM=class{constructor(i){this.scene=i.scene,this.meta=i.meta,this.humanoid=i.humanoid,this.expressionManager=i.expressionManager,this.firstPerson=i.firstPerson,this.lookAt=i.lookAt}update(i){this.humanoid.update(),this.lookAt&&this.lookAt.update(i),this.expressionManager&&this.expressionManager.update()}};var fM=class extends dM{constructor(i){super(i),this.materials=i.materials,this.springBoneManager=i.springBoneManager,this.nodeConstraintManager=i.nodeConstraintManager}update(i){super.update(i),this.nodeConstraintManager&&this.nodeConstraintManager.update(),this.springBoneManager&&this.springBoneManager.update(i),this.materials&&this.materials.forEach(e=>{e.update&&e.update(i)})}},pM=Object.defineProperty,ip=Object.getOwnPropertySymbols,mM=Object.prototype.hasOwnProperty,gM=Object.prototype.propertyIsEnumerable,rp=(i,e,t)=>e in i?pM(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,sp=(i,e)=>{for(var t in e||(e={}))mM.call(e,t)&&rp(i,t,e[t]);if(ip)for(var t of ip(e))gM.call(e,t)&&rp(i,t,e[t]);return i},ur=(i,e,t)=>new Promise((n,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?n(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(i,e)).next())}),_M={"":3e3,srgb:3001};function vM(i,e){parseInt("180",10)>=152?i.colorSpace=e:i.encoding=_M[e]}var yM=class{get pending(){return Promise.all(this._pendings)}constructor(i,e){this._parser=i,this._materialParams=e,this._pendings=[]}assignPrimitive(i,e){e!=null&&(this._materialParams[i]=e)}assignColor(i,e,t){if(e!=null){let n=new he().fromArray(e);t&&n.convertSRGBToLinear(),this._materialParams[i]=n}}assignTexture(i,e,t){return ur(this,null,function*(){let n=ur(this,null,function*(){if(e!=null){let r=yield this._parser.assignTexture(this._materialParams,i,e);if(r==null){console.warn("GLTFMToonMaterialParamsAssignHelper: Failed to load texture. The rendering result may be wrong");return}t&&vM(r,"srgb")}});return this._pendings.push(n),n})}assignTextureByIndex(i,e,t){return ur(this,null,function*(){return this.assignTexture(i,e!=null?{index:e}:void 0,t)})}},xM=`// #define PHONG

varying vec3 vViewPosition;

#ifndef FLAT_SHADED
  varying vec3 vNormal;
#endif

#include <common>

// #include <uv_pars_vertex>
#ifdef MTOON_USE_UV
  varying vec2 vUv;

  // COMPAT: pre-r151 uses a common uvTransform
  #if THREE_VRM_THREE_REVISION < 151
    uniform mat3 uvTransform;
  #endif
#endif

// #include <uv2_pars_vertex>
// COMAPT: pre-r151 uses uv2 for lightMap and aoMap
#if THREE_VRM_THREE_REVISION < 151
  #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
    attribute vec2 uv2;
    varying vec2 vUv2;
    uniform mat3 uv2Transform;
  #endif
#endif

// #include <displacementmap_pars_vertex>
// #include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#ifdef USE_OUTLINEWIDTHMULTIPLYTEXTURE
  uniform sampler2D outlineWidthMultiplyTexture;
  uniform mat3 outlineWidthMultiplyTextureUvTransform;
#endif

uniform float outlineWidthFactor;

void main() {

  // #include <uv_vertex>
  #ifdef MTOON_USE_UV
    // COMPAT: pre-r151 uses a common uvTransform
    #if THREE_VRM_THREE_REVISION >= 151
      vUv = uv;
    #else
      vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
    #endif
  #endif

  // #include <uv2_vertex>
  // COMAPT: pre-r151 uses uv2 for lightMap and aoMap
  #if THREE_VRM_THREE_REVISION < 151
    #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
      vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;
    #endif
  #endif

  #include <color_vertex>

  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>

  // we need this to compute the outline properly
  objectNormal = normalize( objectNormal );

  #include <defaultnormal_vertex>

  #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED
    vNormal = normalize( transformedNormal );
  #endif

  #include <begin_vertex>

  #include <morphtarget_vertex>
  #include <skinning_vertex>
  // #include <displacementmap_vertex>
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>

  vViewPosition = - mvPosition.xyz;

  #ifdef OUTLINE
    float worldNormalLength = length( transformedNormal );
    vec3 outlineOffset = outlineWidthFactor * worldNormalLength * objectNormal;

    #ifdef USE_OUTLINEWIDTHMULTIPLYTEXTURE
      vec2 outlineWidthMultiplyTextureUv = ( outlineWidthMultiplyTextureUvTransform * vec3( vUv, 1 ) ).xy;
      float outlineTex = texture2D( outlineWidthMultiplyTexture, outlineWidthMultiplyTextureUv ).g;
      outlineOffset *= outlineTex;
    #endif

    #ifdef OUTLINE_WIDTH_SCREEN
      outlineOffset *= vViewPosition.z / projectionMatrix[ 1 ].y;
    #endif

    gl_Position = projectionMatrix * modelViewMatrix * vec4( outlineOffset + transformed, 1.0 );

    gl_Position.z += 1E-6 * gl_Position.w; // anti-artifact magic
  #endif

  #include <worldpos_vertex>
  // #include <envmap_vertex>
  #include <shadowmap_vertex>
  #include <fog_vertex>

}`,MM=`// #define PHONG

uniform vec3 litFactor;

uniform float opacity;

uniform vec3 shadeColorFactor;
#ifdef USE_SHADEMULTIPLYTEXTURE
  uniform sampler2D shadeMultiplyTexture;
  uniform mat3 shadeMultiplyTextureUvTransform;
#endif

uniform float shadingShiftFactor;
uniform float shadingToonyFactor;

#ifdef USE_SHADINGSHIFTTEXTURE
  uniform sampler2D shadingShiftTexture;
  uniform mat3 shadingShiftTextureUvTransform;
  uniform float shadingShiftTextureScale;
#endif

uniform float giEqualizationFactor;

uniform vec3 parametricRimColorFactor;
#ifdef USE_RIMMULTIPLYTEXTURE
  uniform sampler2D rimMultiplyTexture;
  uniform mat3 rimMultiplyTextureUvTransform;
#endif
uniform float rimLightingMixFactor;
uniform float parametricRimFresnelPowerFactor;
uniform float parametricRimLiftFactor;

#ifdef USE_MATCAPTEXTURE
  uniform vec3 matcapFactor;
  uniform sampler2D matcapTexture;
  uniform mat3 matcapTextureUvTransform;
#endif

uniform vec3 emissive;
uniform float emissiveIntensity;

uniform vec3 outlineColorFactor;
uniform float outlineLightingMixFactor;

#ifdef USE_UVANIMATIONMASKTEXTURE
  uniform sampler2D uvAnimationMaskTexture;
  uniform mat3 uvAnimationMaskTextureUvTransform;
#endif

uniform float uvAnimationScrollXOffset;
uniform float uvAnimationScrollYOffset;
uniform float uvAnimationRotationPhase;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>

// #include <uv_pars_fragment>
#if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )
  varying vec2 vUv;
#endif

// #include <uv2_pars_fragment>
// COMAPT: pre-r151 uses uv2 for lightMap and aoMap
#if THREE_VRM_THREE_REVISION < 151
  #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
    varying vec2 vUv2;
  #endif
#endif

#include <map_pars_fragment>

#ifdef USE_MAP
  uniform mat3 mapUvTransform;
#endif

// #include <alphamap_pars_fragment>

#include <alphatest_pars_fragment>

#include <aomap_pars_fragment>
// #include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>

#ifdef USE_EMISSIVEMAP
  uniform mat3 emissiveMapUvTransform;
#endif

// #include <envmap_common_pars_fragment>
// #include <envmap_pars_fragment>
// #include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>

// #include <bsdfs>
// COMPAT: pre-r151 doesn't have BRDF_Lambert in <common>
#if THREE_VRM_THREE_REVISION < 151
  vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
    return RECIPROCAL_PI * diffuseColor;
  }
#endif

#include <lights_pars_begin>

#include <normal_pars_fragment>

// #include <lights_phong_pars_fragment>
varying vec3 vViewPosition;

struct MToonMaterial {
  vec3 diffuseColor;
  vec3 shadeColor;
  float shadingShift;
};

float linearstep( float a, float b, float t ) {
  return clamp( ( t - a ) / ( b - a ), 0.0, 1.0 );
}

/**
 * Convert NdotL into toon shading factor using shadingShift and shadingToony
 */
float getShading(
  const in float dotNL,
  const in float shadow,
  const in float shadingShift
) {
  float shading = dotNL;
  shading = shading + shadingShift;
  shading = linearstep( -1.0 + shadingToonyFactor, 1.0 - shadingToonyFactor, shading );
  shading *= shadow;
  return shading;
}

/**
 * Mix diffuseColor and shadeColor using shading factor and light color
 */
vec3 getDiffuse(
  const in MToonMaterial material,
  const in float shading,
  in vec3 lightColor
) {
  #ifdef DEBUG_LITSHADERATE
    return vec3( BRDF_Lambert( shading * lightColor ) );
  #endif

  vec3 col = lightColor * BRDF_Lambert( mix( material.shadeColor, material.diffuseColor, shading ) );

  // The "comment out if you want to PBR absolutely" line
  #ifdef V0_COMPAT_SHADE
    col = min( col, material.diffuseColor );
  #endif

  return col;
}

// COMPAT: pre-r156 uses a struct GeometricContext
#if THREE_VRM_THREE_REVISION >= 157
  void RE_Direct_MToon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in MToonMaterial material, const in float shadow, inout ReflectedLight reflectedLight ) {
    float dotNL = clamp( dot( geometryNormal, directLight.direction ), -1.0, 1.0 );
    vec3 irradiance = directLight.color;

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;

    irradiance *= dotNL;

    float shading = getShading( dotNL, shadow, material.shadingShift );

    // toon shaded diffuse
    reflectedLight.directDiffuse += getDiffuse( material, shading, directLight.color );
  }

  void RE_IndirectDiffuse_MToon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in MToonMaterial material, inout ReflectedLight reflectedLight ) {
    // indirect diffuse will use diffuseColor, no shadeColor involved
    reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;
  }
#else
  void RE_Direct_MToon( const in IncidentLight directLight, const in GeometricContext geometry, const in MToonMaterial material, const in float shadow, inout ReflectedLight reflectedLight ) {
    float dotNL = clamp( dot( geometry.normal, directLight.direction ), -1.0, 1.0 );
    vec3 irradiance = directLight.color;

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;

    irradiance *= dotNL;

    float shading = getShading( dotNL, shadow, material.shadingShift );

    // toon shaded diffuse
    reflectedLight.directDiffuse += getDiffuse( material, shading, directLight.color );
  }

  void RE_IndirectDiffuse_MToon( const in vec3 irradiance, const in GeometricContext geometry, const in MToonMaterial material, inout ReflectedLight reflectedLight ) {
    // indirect diffuse will use diffuseColor, no shadeColor involved
    reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;
  }
#endif

#define RE_Direct RE_Direct_MToon
#define RE_IndirectDiffuse RE_IndirectDiffuse_MToon
#define Material_LightProbeLOD( material ) (0)

#include <shadowmap_pars_fragment>
// #include <bumpmap_pars_fragment>

// #include <normalmap_pars_fragment>
#ifdef USE_NORMALMAP

  uniform sampler2D normalMap;
  uniform mat3 normalMapUvTransform;
  uniform vec2 normalScale;

#endif

// COMPAT: pre-r151
// USE_NORMALMAP_OBJECTSPACE used to be OBJECTSPACE_NORMALMAP in pre-r151
#if defined( USE_NORMALMAP_OBJECTSPACE ) || defined( OBJECTSPACE_NORMALMAP )

  uniform mat3 normalMatrix;

#endif

// COMPAT: pre-r151
// USE_NORMALMAP_TANGENTSPACE used to be TANGENTSPACE_NORMALMAP in pre-r151
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( TANGENTSPACE_NORMALMAP ) )

  // Per-Pixel Tangent Space Normal Mapping
  // tangent-space normal mapping reference

  // three-vrm specific change: it requires \`uv\` as an input in order to support uv scrolls

  // Temporary compat against shader change @ Three.js r126, r151
  #if THREE_VRM_THREE_REVISION >= 151

    mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {

      vec3 q0 = dFdx( eye_pos.xyz );
      vec3 q1 = dFdy( eye_pos.xyz );
      vec2 st0 = dFdx( uv.st );
      vec2 st1 = dFdy( uv.st );

      vec3 N = surf_norm;

      vec3 q1perp = cross( q1, N );
      vec3 q0perp = cross( N, q0 );

      vec3 T = q1perp * st0.x + q0perp * st1.x;
      vec3 B = q1perp * st0.y + q0perp * st1.y;

      float det = max( dot( T, T ), dot( B, B ) );
      float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );

      return mat3( T * scale, B * scale, N );

    }

  #else

    vec3 perturbNormal2Arb( vec2 uv, vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {

      vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
      vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
      vec2 st0 = dFdx( uv.st );
      vec2 st1 = dFdy( uv.st );

      vec3 N = normalize( surf_norm );

      vec3 q1perp = cross( q1, N );
      vec3 q0perp = cross( N, q0 );

      vec3 T = q1perp * st0.x + q0perp * st1.x;
      vec3 B = q1perp * st0.y + q0perp * st1.y;

      // three-vrm specific change: Workaround for the issue that happens when delta of uv = 0.0
      // TODO: Is this still required? Or shall I make a PR about it?
      if ( length( T ) == 0.0 || length( B ) == 0.0 ) {
        return surf_norm;
      }

      float det = max( dot( T, T ), dot( B, B ) );
      float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );

      return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );

    }

  #endif

#endif

// #include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

// == post correction ==========================================================
void postCorrection() {
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>
}

// == main procedure ===========================================================
void main() {
  #include <clipping_planes_fragment>

  vec2 uv = vec2(0.5, 0.5);

  #if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )
    uv = vUv;

    float uvAnimMask = 1.0;
    #ifdef USE_UVANIMATIONMASKTEXTURE
      vec2 uvAnimationMaskTextureUv = ( uvAnimationMaskTextureUvTransform * vec3( uv, 1 ) ).xy;
      uvAnimMask = texture2D( uvAnimationMaskTexture, uvAnimationMaskTextureUv ).b;
    #endif

    float uvRotCos = cos( uvAnimationRotationPhase * uvAnimMask );
    float uvRotSin = sin( uvAnimationRotationPhase * uvAnimMask );
    uv = mat2( uvRotCos, -uvRotSin, uvRotSin, uvRotCos ) * ( uv - 0.5 ) + 0.5;
    uv = uv + vec2( uvAnimationScrollXOffset, uvAnimationScrollYOffset ) * uvAnimMask;
  #endif

  #ifdef DEBUG_UV
    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
    #if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )
      gl_FragColor = vec4( uv, 0.0, 1.0 );
    #endif
    return;
  #endif

  vec4 diffuseColor = vec4( litFactor, opacity );
  ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
  vec3 totalEmissiveRadiance = emissive * emissiveIntensity;

  #include <logdepthbuf_fragment>

  // #include <map_fragment>
  #ifdef USE_MAP
    vec2 mapUv = ( mapUvTransform * vec3( uv, 1 ) ).xy;
    vec4 sampledDiffuseColor = texture2D( map, mapUv );
    #ifdef DECODE_VIDEO_TEXTURE
      sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
    #endif
    diffuseColor *= sampledDiffuseColor;
  #endif

  // #include <color_fragment>
  #if ( defined( USE_COLOR ) && !defined( IGNORE_VERTEX_COLOR ) )
    diffuseColor.rgb *= vColor;
  #endif

  // #include <alphamap_fragment>

  #include <alphatest_fragment>

  // #include <specularmap_fragment>

  // #include <normal_fragment_begin>
  float faceDirection = gl_FrontFacing ? 1.0 : -1.0;

  #ifdef FLAT_SHADED

    vec3 fdx = dFdx( vViewPosition );
    vec3 fdy = dFdy( vViewPosition );
    vec3 normal = normalize( cross( fdx, fdy ) );

  #else

    vec3 normal = normalize( vNormal );

    #ifdef DOUBLE_SIDED

      normal *= faceDirection;

    #endif

  #endif

  #ifdef USE_NORMALMAP

    vec2 normalMapUv = ( normalMapUvTransform * vec3( uv, 1 ) ).xy;

  #endif

  #ifdef USE_NORMALMAP_TANGENTSPACE

    #ifdef USE_TANGENT

      mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );

    #else

      mat3 tbn = getTangentFrame( - vViewPosition, normal, normalMapUv );

    #endif

    #if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )

      tbn[0] *= faceDirection;
      tbn[1] *= faceDirection;

    #endif

  #endif

  #ifdef USE_CLEARCOAT_NORMALMAP

    #ifdef USE_TANGENT

      mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );

    #else

      mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );

    #endif

    #if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )

      tbn2[0] *= faceDirection;
      tbn2[1] *= faceDirection;

    #endif

  #endif

  // non perturbed normal for clearcoat among others

  vec3 nonPerturbedNormal = normal;

  #ifdef OUTLINE
    normal *= -1.0;
  #endif

  // #include <normal_fragment_maps>

  // COMPAT: pre-r151
  // USE_NORMALMAP_OBJECTSPACE used to be OBJECTSPACE_NORMALMAP in pre-r151
  #if defined( USE_NORMALMAP_OBJECTSPACE ) || defined( OBJECTSPACE_NORMALMAP )

    normal = texture2D( normalMap, normalMapUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals

    #ifdef FLIP_SIDED

      normal = - normal;

    #endif

    #ifdef DOUBLE_SIDED

      normal = normal * faceDirection;

    #endif

    normal = normalize( normalMatrix * normal );

  // COMPAT: pre-r151
  // USE_NORMALMAP_TANGENTSPACE used to be TANGENTSPACE_NORMALMAP in pre-r151
  #elif defined( USE_NORMALMAP_TANGENTSPACE ) || defined( TANGENTSPACE_NORMALMAP )

    vec3 mapN = texture2D( normalMap, normalMapUv ).xyz * 2.0 - 1.0;
    mapN.xy *= normalScale;

    // COMPAT: pre-r151
    #if THREE_VRM_THREE_REVISION >= 151 || defined( USE_TANGENT )

      normal = normalize( tbn * mapN );

    #else

      normal = perturbNormal2Arb( uv, -vViewPosition, normal, mapN, faceDirection );

    #endif

  #endif

  // #include <emissivemap_fragment>
  #ifdef USE_EMISSIVEMAP
    vec2 emissiveMapUv = ( emissiveMapUvTransform * vec3( uv, 1 ) ).xy;
    totalEmissiveRadiance *= texture2D( emissiveMap, emissiveMapUv ).rgb;
  #endif

  #ifdef DEBUG_NORMAL
    gl_FragColor = vec4( 0.5 + 0.5 * normal, 1.0 );
    return;
  #endif

  // -- MToon: lighting --------------------------------------------------------
  // accumulation
  // #include <lights_phong_fragment>
  MToonMaterial material;

  material.diffuseColor = diffuseColor.rgb;

  material.shadeColor = shadeColorFactor;
  #ifdef USE_SHADEMULTIPLYTEXTURE
    vec2 shadeMultiplyTextureUv = ( shadeMultiplyTextureUvTransform * vec3( uv, 1 ) ).xy;
    material.shadeColor *= texture2D( shadeMultiplyTexture, shadeMultiplyTextureUv ).rgb;
  #endif

  #if ( defined( USE_COLOR ) && !defined( IGNORE_VERTEX_COLOR ) )
    material.shadeColor.rgb *= vColor;
  #endif

  material.shadingShift = shadingShiftFactor;
  #ifdef USE_SHADINGSHIFTTEXTURE
    vec2 shadingShiftTextureUv = ( shadingShiftTextureUvTransform * vec3( uv, 1 ) ).xy;
    material.shadingShift += texture2D( shadingShiftTexture, shadingShiftTextureUv ).r * shadingShiftTextureScale;
  #endif

  // #include <lights_fragment_begin>

  // MToon Specific changes:
  // Since we want to take shadows into account of shading instead of irradiance,
  // we had to modify the codes that multiplies the results of shadowmap into color of direct lights.

  // COMPAT: pre-r156 uses a struct GeometricContext
  #if THREE_VRM_THREE_REVISION >= 157
    vec3 geometryPosition = - vViewPosition;
    vec3 geometryNormal = normal;
    vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

    vec3 geometryClearcoatNormal;

    #ifdef USE_CLEARCOAT

      geometryClearcoatNormal = clearcoatNormal;

    #endif
  #else
    GeometricContext geometry;

    geometry.position = - vViewPosition;
    geometry.normal = normal;
    geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

    #ifdef USE_CLEARCOAT

      geometry.clearcoatNormal = clearcoatNormal;

    #endif
  #endif

  IncidentLight directLight;

  // since these variables will be used in unrolled loop, we have to define in prior
  float shadow;

  #if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

    PointLight pointLight;
    #if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
    PointLightShadow pointLightShadow;
    #endif

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

      pointLight = pointLights[ i ];

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        getPointLightInfo( pointLight, geometryPosition, directLight );
      #else
        getPointLightInfo( pointLight, geometry, directLight );
      #endif

      shadow = 1.0;
      #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
      pointLightShadow = pointLightShadows[ i ];
      // COMPAT: pre-r166
      // r166 introduced shadowIntensity
      #if THREE_VRM_THREE_REVISION >= 166
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
      #else
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
      #endif
      #endif

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );
      #else
        RE_Direct( directLight, geometry, material, shadow, reflectedLight );
      #endif

    }
    #pragma unroll_loop_end

  #endif

  #if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

    SpotLight spotLight;
    // COMPAT: pre-r144 uses NUM_SPOT_LIGHT_SHADOWS, r144+ uses NUM_SPOT_LIGHT_COORDS
    #if THREE_VRM_THREE_REVISION >= 144
      #if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_COORDS > 0
      SpotLightShadow spotLightShadow;
      #endif
    #elif defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
    SpotLightShadow spotLightShadow;
    #endif

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

      spotLight = spotLights[ i ];

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        getSpotLightInfo( spotLight, geometryPosition, directLight );
      #else
        getSpotLightInfo( spotLight, geometry, directLight );
      #endif

      shadow = 1.0;
      // COMPAT: pre-r144 uses NUM_SPOT_LIGHT_SHADOWS and vSpotShadowCoord, r144+ uses NUM_SPOT_LIGHT_COORDS and vSpotLightCoord
      // COMPAT: pre-r166 does not have shadowIntensity, r166+ has shadowIntensity
      #if THREE_VRM_THREE_REVISION >= 166
        #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_COORDS )
        spotLightShadow = spotLightShadows[ i ];
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
        #endif
      #elif THREE_VRM_THREE_REVISION >= 144
        #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_COORDS )
        spotLightShadow = spotLightShadows[ i ];
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
        #endif
      #elif defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
      spotLightShadow = spotLightShadows[ i ];
      shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
      #endif

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );
      #else
        RE_Direct( directLight, geometry, material, shadow, reflectedLight );
      #endif

    }
    #pragma unroll_loop_end

  #endif

  #if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )

    DirectionalLight directionalLight;
    #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
    DirectionalLightShadow directionalLightShadow;
    #endif

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

      directionalLight = directionalLights[ i ];

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        getDirectionalLightInfo( directionalLight, directLight );
      #else
        getDirectionalLightInfo( directionalLight, geometry, directLight );
      #endif

      shadow = 1.0;
      #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
      directionalLightShadow = directionalLightShadows[ i ];
      // COMPAT: pre-r166
      // r166 introduced shadowIntensity
      #if THREE_VRM_THREE_REVISION >= 166
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
      #else
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
      #endif
      #endif

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );
      #else
        RE_Direct( directLight, geometry, material, shadow, reflectedLight );
      #endif

    }
    #pragma unroll_loop_end

  #endif

  // #if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

  //   RectAreaLight rectAreaLight;

  //   #pragma unroll_loop_start
  //   for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

  //     rectAreaLight = rectAreaLights[ i ];
  //     RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );

  //   }
  //   #pragma unroll_loop_end

  // #endif

  #if defined( RE_IndirectDiffuse )

    vec3 iblIrradiance = vec3( 0.0 );

    vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

    // COMPAT: pre-r156 uses a struct GeometricContext
    // COMPAT: pre-r156 doesn't have a define USE_LIGHT_PROBES
    #if THREE_VRM_THREE_REVISION >= 157
      #if defined( USE_LIGHT_PROBES )
        irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
      #endif
    #else
      irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );
    #endif

    #if ( NUM_HEMI_LIGHTS > 0 )

      #pragma unroll_loop_start
      for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

        // COMPAT: pre-r156 uses a struct GeometricContext
        #if THREE_VRM_THREE_REVISION >= 157
          irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
        #else
          irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );
        #endif

      }
      #pragma unroll_loop_end

    #endif

  #endif

  // #if defined( RE_IndirectSpecular )

  //   vec3 radiance = vec3( 0.0 );
  //   vec3 clearcoatRadiance = vec3( 0.0 );

  // #endif

  #include <lights_fragment_maps>
  #include <lights_fragment_end>

  // modulation
  #include <aomap_fragment>

  vec3 col = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;

  #ifdef DEBUG_LITSHADERATE
    gl_FragColor = vec4( col, diffuseColor.a );
    postCorrection();
    return;
  #endif

  // -- MToon: rim lighting -----------------------------------------
  vec3 viewDir = normalize( vViewPosition );

  #ifndef PHYSICALLY_CORRECT_LIGHTS
    reflectedLight.directSpecular /= PI;
  #endif
  vec3 rimMix = mix( vec3( 1.0 ), reflectedLight.directSpecular, rimLightingMixFactor );

  vec3 rim = parametricRimColorFactor * pow( saturate( 1.0 - dot( viewDir, normal ) + parametricRimLiftFactor ), parametricRimFresnelPowerFactor );

  #ifdef USE_MATCAPTEXTURE
    {
      vec3 x = normalize( vec3( viewDir.z, 0.0, -viewDir.x ) );
      vec3 y = cross( viewDir, x ); // guaranteed to be normalized
      vec2 sphereUv = 0.5 + 0.5 * vec2( dot( x, normal ), -dot( y, normal ) );
      sphereUv = ( matcapTextureUvTransform * vec3( sphereUv, 1 ) ).xy;
      vec3 matcap = texture2D( matcapTexture, sphereUv ).rgb;
      rim += matcapFactor * matcap;
    }
  #endif

  #ifdef USE_RIMMULTIPLYTEXTURE
    vec2 rimMultiplyTextureUv = ( rimMultiplyTextureUvTransform * vec3( uv, 1 ) ).xy;
    rim *= texture2D( rimMultiplyTexture, rimMultiplyTextureUv ).rgb;
  #endif

  col += rimMix * rim;

  // -- MToon: Emission --------------------------------------------------------
  col += totalEmissiveRadiance;

  // #include <envmap_fragment>

  // -- Almost done! -----------------------------------------------------------
  #if defined( OUTLINE )
    col = outlineColorFactor.rgb * mix( vec3( 1.0 ), col, outlineLightingMixFactor );
  #endif

  #ifdef OPAQUE
    diffuseColor.a = 1.0;
  #endif

  gl_FragColor = vec4( col, diffuseColor.a );
  postCorrection();
}
`,EM={None:"none",Normal:"normal",LitShadeRate:"litShadeRate",UV:"uv"},op={None:"none",WorldCoordinates:"worldCoordinates",ScreenCoordinates:"screenCoordinates"},bM={3e3:"",3001:"srgb"};function Xu(i){return parseInt("180",10)>=152?i.colorSpace:bM[i.encoding]}var oh=class extends on{constructor(i={}){var e;super({vertexShader:xM,fragmentShader:MM}),this.uvAnimationScrollXSpeedFactor=0,this.uvAnimationScrollYSpeedFactor=0,this.uvAnimationRotationSpeedFactor=0,this.fog=!0,this.normalMapType=co,this._ignoreVertexColor=!0,this._v0CompatShade=!1,this._debugMode=EM.None,this._outlineWidthMode=op.None,this._isOutline=!1,i.transparentWithZWrite&&(i.depthWrite=!0),delete i.transparentWithZWrite,i.fog=!0,i.lights=!0,i.clipping=!0,this.uniforms=fl.merge([oe.common,oe.normalmap,oe.emissivemap,oe.fog,oe.lights,{litFactor:{value:new he(1,1,1)},mapUvTransform:{value:new Re},colorAlpha:{value:1},normalMapUvTransform:{value:new Re},shadeColorFactor:{value:new he(0,0,0)},shadeMultiplyTexture:{value:null},shadeMultiplyTextureUvTransform:{value:new Re},shadingShiftFactor:{value:0},shadingShiftTexture:{value:null},shadingShiftTextureUvTransform:{value:new Re},shadingShiftTextureScale:{value:1},shadingToonyFactor:{value:.9},giEqualizationFactor:{value:.9},matcapFactor:{value:new he(1,1,1)},matcapTexture:{value:null},matcapTextureUvTransform:{value:new Re},parametricRimColorFactor:{value:new he(0,0,0)},rimMultiplyTexture:{value:null},rimMultiplyTextureUvTransform:{value:new Re},rimLightingMixFactor:{value:1},parametricRimFresnelPowerFactor:{value:5},parametricRimLiftFactor:{value:0},emissive:{value:new he(0,0,0)},emissiveIntensity:{value:1},emissiveMapUvTransform:{value:new Re},outlineWidthMultiplyTexture:{value:null},outlineWidthMultiplyTextureUvTransform:{value:new Re},outlineWidthFactor:{value:0},outlineColorFactor:{value:new he(0,0,0)},outlineLightingMixFactor:{value:1},uvAnimationMaskTexture:{value:null},uvAnimationMaskTextureUvTransform:{value:new Re},uvAnimationScrollXOffset:{value:0},uvAnimationScrollYOffset:{value:0},uvAnimationRotationPhase:{value:0}},(e=i.uniforms)!=null?e:{}]),this.setValues(i),this._uploadUniformsWorkaround(),this.customProgramCacheKey=()=>[...Object.entries(this._generateDefines()).map(([t,n])=>`${t}:${n}`),this.matcapTexture?`matcapTextureColorSpace:${Xu(this.matcapTexture)}`:"",this.shadeMultiplyTexture?`shadeMultiplyTextureColorSpace:${Xu(this.shadeMultiplyTexture)}`:"",this.rimMultiplyTexture?`rimMultiplyTextureColorSpace:${Xu(this.rimMultiplyTexture)}`:""].join(","),this.onBeforeCompile=t=>{let n=parseInt("180",10),r=Object.entries(sp(sp({},this._generateDefines()),this.defines)).filter(([s,o])=>!!o).map(([s,o])=>`#define ${s} ${o}`).join(`
`)+`
`;t.vertexShader=r+t.vertexShader,t.fragmentShader=r+t.fragmentShader,n<154&&(t.fragmentShader=t.fragmentShader.replace("#include <colorspace_fragment>","#include <encodings_fragment>"))}}get color(){return this.uniforms.litFactor.value}set color(i){this.uniforms.litFactor.value=i}get map(){return this.uniforms.map.value}set map(i){this.uniforms.map.value=i}get normalMap(){return this.uniforms.normalMap.value}set normalMap(i){this.uniforms.normalMap.value=i}get normalScale(){return this.uniforms.normalScale.value}set normalScale(i){this.uniforms.normalScale.value=i}get emissive(){return this.uniforms.emissive.value}set emissive(i){this.uniforms.emissive.value=i}get emissiveIntensity(){return this.uniforms.emissiveIntensity.value}set emissiveIntensity(i){this.uniforms.emissiveIntensity.value=i}get emissiveMap(){return this.uniforms.emissiveMap.value}set emissiveMap(i){this.uniforms.emissiveMap.value=i}get shadeColorFactor(){return this.uniforms.shadeColorFactor.value}set shadeColorFactor(i){this.uniforms.shadeColorFactor.value=i}get shadeMultiplyTexture(){return this.uniforms.shadeMultiplyTexture.value}set shadeMultiplyTexture(i){this.uniforms.shadeMultiplyTexture.value=i}get shadingShiftFactor(){return this.uniforms.shadingShiftFactor.value}set shadingShiftFactor(i){this.uniforms.shadingShiftFactor.value=i}get shadingShiftTexture(){return this.uniforms.shadingShiftTexture.value}set shadingShiftTexture(i){this.uniforms.shadingShiftTexture.value=i}get shadingShiftTextureScale(){return this.uniforms.shadingShiftTextureScale.value}set shadingShiftTextureScale(i){this.uniforms.shadingShiftTextureScale.value=i}get shadingToonyFactor(){return this.uniforms.shadingToonyFactor.value}set shadingToonyFactor(i){this.uniforms.shadingToonyFactor.value=i}get giEqualizationFactor(){return this.uniforms.giEqualizationFactor.value}set giEqualizationFactor(i){this.uniforms.giEqualizationFactor.value=i}get matcapFactor(){return this.uniforms.matcapFactor.value}set matcapFactor(i){this.uniforms.matcapFactor.value=i}get matcapTexture(){return this.uniforms.matcapTexture.value}set matcapTexture(i){this.uniforms.matcapTexture.value=i}get parametricRimColorFactor(){return this.uniforms.parametricRimColorFactor.value}set parametricRimColorFactor(i){this.uniforms.parametricRimColorFactor.value=i}get rimMultiplyTexture(){return this.uniforms.rimMultiplyTexture.value}set rimMultiplyTexture(i){this.uniforms.rimMultiplyTexture.value=i}get rimLightingMixFactor(){return this.uniforms.rimLightingMixFactor.value}set rimLightingMixFactor(i){this.uniforms.rimLightingMixFactor.value=i}get parametricRimFresnelPowerFactor(){return this.uniforms.parametricRimFresnelPowerFactor.value}set parametricRimFresnelPowerFactor(i){this.uniforms.parametricRimFresnelPowerFactor.value=i}get parametricRimLiftFactor(){return this.uniforms.parametricRimLiftFactor.value}set parametricRimLiftFactor(i){this.uniforms.parametricRimLiftFactor.value=i}get outlineWidthMultiplyTexture(){return this.uniforms.outlineWidthMultiplyTexture.value}set outlineWidthMultiplyTexture(i){this.uniforms.outlineWidthMultiplyTexture.value=i}get outlineWidthFactor(){return this.uniforms.outlineWidthFactor.value}set outlineWidthFactor(i){this.uniforms.outlineWidthFactor.value=i}get outlineColorFactor(){return this.uniforms.outlineColorFactor.value}set outlineColorFactor(i){this.uniforms.outlineColorFactor.value=i}get outlineLightingMixFactor(){return this.uniforms.outlineLightingMixFactor.value}set outlineLightingMixFactor(i){this.uniforms.outlineLightingMixFactor.value=i}get uvAnimationMaskTexture(){return this.uniforms.uvAnimationMaskTexture.value}set uvAnimationMaskTexture(i){this.uniforms.uvAnimationMaskTexture.value=i}get uvAnimationScrollXOffset(){return this.uniforms.uvAnimationScrollXOffset.value}set uvAnimationScrollXOffset(i){this.uniforms.uvAnimationScrollXOffset.value=i}get uvAnimationScrollYOffset(){return this.uniforms.uvAnimationScrollYOffset.value}set uvAnimationScrollYOffset(i){this.uniforms.uvAnimationScrollYOffset.value=i}get uvAnimationRotationPhase(){return this.uniforms.uvAnimationRotationPhase.value}set uvAnimationRotationPhase(i){this.uniforms.uvAnimationRotationPhase.value=i}get ignoreVertexColor(){return this._ignoreVertexColor}set ignoreVertexColor(i){this._ignoreVertexColor=i,this.needsUpdate=!0}get v0CompatShade(){return this._v0CompatShade}set v0CompatShade(i){this._v0CompatShade=i,this.needsUpdate=!0}get debugMode(){return this._debugMode}set debugMode(i){this._debugMode=i,this.needsUpdate=!0}get outlineWidthMode(){return this._outlineWidthMode}set outlineWidthMode(i){this._outlineWidthMode=i,this.needsUpdate=!0}get isOutline(){return this._isOutline}set isOutline(i){this._isOutline=i,this.needsUpdate=!0}get isMToonMaterial(){return!0}update(i){this._uploadUniformsWorkaround(),this._updateUVAnimation(i)}copy(i){return super.copy(i),this.map=i.map,this.normalMap=i.normalMap,this.emissiveMap=i.emissiveMap,this.shadeMultiplyTexture=i.shadeMultiplyTexture,this.shadingShiftTexture=i.shadingShiftTexture,this.matcapTexture=i.matcapTexture,this.rimMultiplyTexture=i.rimMultiplyTexture,this.outlineWidthMultiplyTexture=i.outlineWidthMultiplyTexture,this.uvAnimationMaskTexture=i.uvAnimationMaskTexture,this.normalMapType=i.normalMapType,this.uvAnimationScrollXSpeedFactor=i.uvAnimationScrollXSpeedFactor,this.uvAnimationScrollYSpeedFactor=i.uvAnimationScrollYSpeedFactor,this.uvAnimationRotationSpeedFactor=i.uvAnimationRotationSpeedFactor,this.ignoreVertexColor=i.ignoreVertexColor,this.v0CompatShade=i.v0CompatShade,this.debugMode=i.debugMode,this.outlineWidthMode=i.outlineWidthMode,this.isOutline=i.isOutline,this.needsUpdate=!0,this}_updateUVAnimation(i){this.uniforms.uvAnimationScrollXOffset.value+=i*this.uvAnimationScrollXSpeedFactor,this.uniforms.uvAnimationScrollYOffset.value+=i*this.uvAnimationScrollYSpeedFactor,this.uniforms.uvAnimationRotationPhase.value+=i*this.uvAnimationRotationSpeedFactor,this.uniforms.alphaTest.value=this.alphaTest,this.uniformsNeedUpdate=!0}_uploadUniformsWorkaround(){this.uniforms.opacity.value=this.opacity,this._updateTextureMatrix(this.uniforms.map,this.uniforms.mapUvTransform),this._updateTextureMatrix(this.uniforms.normalMap,this.uniforms.normalMapUvTransform),this._updateTextureMatrix(this.uniforms.emissiveMap,this.uniforms.emissiveMapUvTransform),this._updateTextureMatrix(this.uniforms.shadeMultiplyTexture,this.uniforms.shadeMultiplyTextureUvTransform),this._updateTextureMatrix(this.uniforms.shadingShiftTexture,this.uniforms.shadingShiftTextureUvTransform),this._updateTextureMatrix(this.uniforms.matcapTexture,this.uniforms.matcapTextureUvTransform),this._updateTextureMatrix(this.uniforms.rimMultiplyTexture,this.uniforms.rimMultiplyTextureUvTransform),this._updateTextureMatrix(this.uniforms.outlineWidthMultiplyTexture,this.uniforms.outlineWidthMultiplyTextureUvTransform),this._updateTextureMatrix(this.uniforms.uvAnimationMaskTexture,this.uniforms.uvAnimationMaskTextureUvTransform),this.uniformsNeedUpdate=!0}_generateDefines(){let i=parseInt("180",10),e=this.outlineWidthMultiplyTexture!==null,t=this.map!==null||this.normalMap!==null||this.emissiveMap!==null||this.shadeMultiplyTexture!==null||this.shadingShiftTexture!==null||this.rimMultiplyTexture!==null||this.uvAnimationMaskTexture!==null;return{THREE_VRM_THREE_REVISION:i,OUTLINE:this._isOutline,MTOON_USE_UV:e||t,MTOON_UVS_VERTEX_ONLY:e&&!t,V0_COMPAT_SHADE:this._v0CompatShade,USE_SHADEMULTIPLYTEXTURE:this.shadeMultiplyTexture!==null,USE_SHADINGSHIFTTEXTURE:this.shadingShiftTexture!==null,USE_MATCAPTEXTURE:this.matcapTexture!==null,USE_RIMMULTIPLYTEXTURE:this.rimMultiplyTexture!==null,USE_OUTLINEWIDTHMULTIPLYTEXTURE:this._isOutline&&this.outlineWidthMultiplyTexture!==null,USE_UVANIMATIONMASKTEXTURE:this.uvAnimationMaskTexture!==null,IGNORE_VERTEX_COLOR:this._ignoreVertexColor===!0,DEBUG_NORMAL:this._debugMode==="normal",DEBUG_LITSHADERATE:this._debugMode==="litShadeRate",DEBUG_UV:this._debugMode==="uv",OUTLINE_WIDTH_SCREEN:this._isOutline&&this._outlineWidthMode===op.ScreenCoordinates}}_updateTextureMatrix(i,e){i.value&&(i.value.matrixAutoUpdate&&i.value.updateMatrix(),e.value.copy(i.value.matrix))}},SM=new Set(["1.0","1.0-beta"]),Ip=class Al{get name(){return Al.EXTENSION_NAME}constructor(e,t={}){var n,r,s,o;this.parser=e,this.materialType=(n=t.materialType)!=null?n:oh,this.renderOrderOffset=(r=t.renderOrderOffset)!=null?r:0,this.v0CompatShade=(s=t.v0CompatShade)!=null?s:!1,this.debugMode=(o=t.debugMode)!=null?o:"none",this._mToonMaterialSet=new Set}beforeRoot(){return ur(this,null,function*(){this._removeUnlitExtensionIfMToonExists()})}afterRoot(e){return ur(this,null,function*(){e.userData.vrmMToonMaterials=Array.from(this._mToonMaterialSet)})}getMaterialType(e){return this._getMToonExtension(e)?this.materialType:null}extendMaterialParams(e,t){let n=this._getMToonExtension(e);return n?this._extendMaterialParams(n,t):null}loadMesh(e){return ur(this,null,function*(){var t;let n=this.parser,s=(t=n.json.meshes)==null?void 0:t[e];if(s==null)throw new Error(`MToonMaterialLoaderPlugin: Attempt to use meshes[${e}] of glTF but the mesh doesn't exist`);let o=s.primitives,a=yield n.loadMesh(e);if(o.length===1){let l=a,c=o[0].material;c!=null&&this._setupPrimitive(l,c)}else{let l=a;for(let c=0;c<o.length;c++){let u=l.children[c],h=o[c].material;h!=null&&this._setupPrimitive(u,h)}}return a})}_removeUnlitExtensionIfMToonExists(){let n=this.parser.json.materials;n?.map((r,s)=>{var o;this._getMToonExtension(s)&&((o=r.extensions)!=null&&o.KHR_materials_unlit)&&delete r.extensions.KHR_materials_unlit})}_getMToonExtension(e){var t,n;let o=(t=this.parser.json.materials)==null?void 0:t[e];if(o==null){console.warn(`MToonMaterialLoaderPlugin: Attempt to use materials[${e}] of glTF but the material doesn't exist`);return}let a=(n=o.extensions)==null?void 0:n[Al.EXTENSION_NAME];if(a==null)return;let l=a.specVersion;if(!SM.has(l)){console.warn(`MToonMaterialLoaderPlugin: Unknown ${Al.EXTENSION_NAME} specVersion "${l}"`);return}return a}_extendMaterialParams(e,t){return ur(this,null,function*(){var n;delete t.metalness,delete t.roughness;let r=new yM(this.parser,t);r.assignPrimitive("transparentWithZWrite",e.transparentWithZWrite),r.assignColor("shadeColorFactor",e.shadeColorFactor),r.assignTexture("shadeMultiplyTexture",e.shadeMultiplyTexture,!0),r.assignPrimitive("shadingShiftFactor",e.shadingShiftFactor),r.assignTexture("shadingShiftTexture",e.shadingShiftTexture,!0),r.assignPrimitive("shadingShiftTextureScale",(n=e.shadingShiftTexture)==null?void 0:n.scale),r.assignPrimitive("shadingToonyFactor",e.shadingToonyFactor),r.assignPrimitive("giEqualizationFactor",e.giEqualizationFactor),r.assignColor("matcapFactor",e.matcapFactor),r.assignTexture("matcapTexture",e.matcapTexture,!0),r.assignColor("parametricRimColorFactor",e.parametricRimColorFactor),r.assignTexture("rimMultiplyTexture",e.rimMultiplyTexture,!0),r.assignPrimitive("rimLightingMixFactor",e.rimLightingMixFactor),r.assignPrimitive("parametricRimFresnelPowerFactor",e.parametricRimFresnelPowerFactor),r.assignPrimitive("parametricRimLiftFactor",e.parametricRimLiftFactor),r.assignPrimitive("outlineWidthMode",e.outlineWidthMode),r.assignPrimitive("outlineWidthFactor",e.outlineWidthFactor),r.assignTexture("outlineWidthMultiplyTexture",e.outlineWidthMultiplyTexture,!1),r.assignColor("outlineColorFactor",e.outlineColorFactor),r.assignPrimitive("outlineLightingMixFactor",e.outlineLightingMixFactor),r.assignTexture("uvAnimationMaskTexture",e.uvAnimationMaskTexture,!1),r.assignPrimitive("uvAnimationScrollXSpeedFactor",e.uvAnimationScrollXSpeedFactor),r.assignPrimitive("uvAnimationScrollYSpeedFactor",e.uvAnimationScrollYSpeedFactor),r.assignPrimitive("uvAnimationRotationSpeedFactor",e.uvAnimationRotationSpeedFactor),r.assignPrimitive("v0CompatShade",this.v0CompatShade),r.assignPrimitive("debugMode",this.debugMode),yield r.pending})}_setupPrimitive(e,t){let n=this._getMToonExtension(t);if(n){let r=this._parseRenderOrder(n);e.renderOrder=r+this.renderOrderOffset,this._generateOutline(e),this._addToMaterialSet(e);return}}_shouldGenerateOutline(e){return typeof e.outlineWidthMode=="string"&&e.outlineWidthMode!=="none"&&typeof e.outlineWidthFactor=="number"&&e.outlineWidthFactor>0}_generateOutline(e){let t=e.material;if(!(t instanceof Ht)||!this._shouldGenerateOutline(t))return;e.material=[t];let n=t.clone();n.name+=" (Outline)",n.isOutline=!0,n.side=Ot,e.material.push(n);let r=e.geometry,s=r.index?r.index.count:r.attributes.position.count/3;r.addGroup(0,s,0),r.addGroup(0,s,1)}_addToMaterialSet(e){let t=e.material,n=new Set;Array.isArray(t)?t.forEach(r=>n.add(r)):n.add(t);for(let r of n)this._mToonMaterialSet.add(r)}_parseRenderOrder(e){var t;return(e.transparentWithZWrite?0:19)+((t=e.renderQueueOffsetNumber)!=null?t:0)}};Ip.EXTENSION_NAME="VRMC_materials_mtoon";var TM=Ip,wM=(i,e,t)=>new Promise((n,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?n(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(i,e)).next())}),Lp=class ih{get name(){return ih.EXTENSION_NAME}constructor(e){this.parser=e}extendMaterialParams(e,t){return wM(this,null,function*(){let n=this._getHDREmissiveMultiplierExtension(e);if(n==null)return;console.warn("VRMMaterialsHDREmissiveMultiplierLoaderPlugin: `VRMC_materials_hdr_emissiveMultiplier` is archived. Use `KHR_materials_emissive_strength` instead.");let r=n.emissiveMultiplier;t.emissiveIntensity=r})}_getHDREmissiveMultiplierExtension(e){var t,n;let o=(t=this.parser.json.materials)==null?void 0:t[e];if(o==null){console.warn(`VRMMaterialsHDREmissiveMultiplierLoaderPlugin: Attempt to use materials[${e}] of glTF but the material doesn't exist`);return}let a=(n=o.extensions)==null?void 0:n[ih.EXTENSION_NAME];if(a!=null)return a}};Lp.EXTENSION_NAME="VRMC_materials_hdr_emissiveMultiplier";var AM=Lp,RM=Object.defineProperty,CM=Object.defineProperties,PM=Object.getOwnPropertyDescriptors,ap=Object.getOwnPropertySymbols,IM=Object.prototype.hasOwnProperty,LM=Object.prototype.propertyIsEnumerable,lp=(i,e,t)=>e in i?RM(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,Wn=(i,e)=>{for(var t in e||(e={}))IM.call(e,t)&&lp(i,t,e[t]);if(ap)for(var t of ap(e))LM.call(e,t)&&lp(i,t,e[t]);return i},cp=(i,e)=>CM(i,PM(e)),DM=(i,e,t)=>new Promise((n,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?n(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(i,e)).next())});function is(i){return Math.pow(i,2.2)}var NM=class{get name(){return"VRMMaterialsV0CompatPlugin"}constructor(i){var e;this.parser=i,this._renderQueueMapTransparent=new Map,this._renderQueueMapTransparentZWrite=new Map;let t=this.parser.json;t.extensionsUsed=(e=t.extensionsUsed)!=null?e:[],t.extensionsUsed.indexOf("KHR_texture_transform")===-1&&t.extensionsUsed.push("KHR_texture_transform")}beforeRoot(){return DM(this,null,function*(){var i;let e=this.parser.json,t=(i=e.extensions)==null?void 0:i.VRM,n=t?.materialProperties;n&&(this._populateRenderQueueMap(n),n.forEach((r,s)=>{var o,a;let l=(o=e.materials)==null?void 0:o[s];if(l==null){console.warn(`VRMMaterialsV0CompatPlugin: Attempt to use materials[${s}] of glTF but the material doesn't exist`);return}if(r.shader==="VRM/MToon"){let c=this._parseV0MToonProperties(r,l);e.materials[s]=c}else if((a=r.shader)!=null&&a.startsWith("VRM/Unlit")){let c=this._parseV0UnlitProperties(r,l);e.materials[s]=c}else r.shader==="VRM_USE_GLTFSHADER"||console.warn(`VRMMaterialsV0CompatPlugin: Unknown shader: ${r.shader}`)}))})}_parseV0MToonProperties(i,e){var t,n,r,s,o,a,l,c,u,h,d,f,g,_,m,p,T,b,y,A,w,C,L,E,M,P,F,V,X,j,z,K,H,ae,re,Ae,Ge,rt,dt,Je,q,Z,pe,Oe,Te,Xe,Ct,I,ft,ke,De,ve,pt,ye,ze;let St=(n=(t=i.keywordMap)==null?void 0:t._ALPHABLEND_ON)!=null?n:!1,R=((r=i.floatProperties)==null?void 0:r._ZWrite)===1&&St,v=this._v0ParseRenderQueue(i),O=(o=(s=i.keywordMap)==null?void 0:s._ALPHATEST_ON)!=null?o:!1,W=St?"BLEND":O?"MASK":"OPAQUE",$=O?(l=(a=i.floatProperties)==null?void 0:a._Cutoff)!=null?l:.5:void 0,we=((u=(c=i.floatProperties)==null?void 0:c._CullMode)!=null?u:2)===0,Q=this._portTextureTransform(i),Ee=((d=(h=i.vectorProperties)==null?void 0:h._Color)!=null?d:[1,1,1,1]).map((B,k)=>k===3?B:is(B)),be=(f=i.textureProperties)==null?void 0:f._MainTex,ee=be!=null?{index:be,extensions:Wn({},Q)}:void 0,ce=(_=(g=i.floatProperties)==null?void 0:g._BumpScale)!=null?_:1,Pe=(m=i.textureProperties)==null?void 0:m._BumpMap,Se=Pe!=null?{index:Pe,scale:ce,extensions:Wn({},Q)}:void 0,le=((T=(p=i.vectorProperties)==null?void 0:p._EmissionColor)!=null?T:[0,0,0,1]).map(is),Ve=(b=i.textureProperties)==null?void 0:b._EmissionMap,D=Ve!=null?{index:Ve,extensions:Wn({},Q)}:void 0,te=((A=(y=i.vectorProperties)==null?void 0:y._ShadeColor)!=null?A:[.97,.81,.86,1]).map(is),se=(w=i.textureProperties)==null?void 0:w._ShadeTexture,de=se!=null?{index:se,extensions:Wn({},Q)}:void 0,J=(L=(C=i.floatProperties)==null?void 0:C._ShadeShift)!=null?L:0,Y=(M=(E=i.floatProperties)==null?void 0:E._ShadeToony)!=null?M:.9;Y=Ne.lerp(Y,1,.5+.5*J),J=-J-(1-Y);let ge=(F=(P=i.floatProperties)==null?void 0:P._IndirectLightIntensity)!=null?F:.1,He=ge?1-ge:void 0,it=(V=i.textureProperties)==null?void 0:V._SphereAdd,Ke=it!=null?[1,1,1]:void 0,Sn=it!=null?{index:it}:void 0,hn=(j=(X=i.floatProperties)==null?void 0:X._RimLightingMix)!=null?j:0,gs=(z=i.textureProperties)==null?void 0:z._RimTexture,$n=gs!=null?{index:gs,extensions:Wn({},Q)}:void 0,_s=((H=(K=i.vectorProperties)==null?void 0:K._RimColor)!=null?H:[0,0,0,1]).map(is),So=(re=(ae=i.floatProperties)==null?void 0:ae._RimFresnelPower)!=null?re:1,To=(Ge=(Ae=i.floatProperties)==null?void 0:Ae._RimLift)!=null?Ge:0,dr=["none","worldCoordinates","screenCoordinates"][(dt=(rt=i.floatProperties)==null?void 0:rt._OutlineWidthMode)!=null?dt:0],fr=(q=(Je=i.floatProperties)==null?void 0:Je._OutlineWidth)!=null?q:0;fr=.01*fr;let Di=(Z=i.textureProperties)==null?void 0:Z._OutlineWidthTexture,wo=Di!=null?{index:Di,extensions:Wn({},Q)}:void 0,Ao=((Oe=(pe=i.vectorProperties)==null?void 0:pe._OutlineColor)!=null?Oe:[0,0,0]).map(is),Vl=((Xe=(Te=i.floatProperties)==null?void 0:Te._OutlineColorMode)!=null?Xe:0)===1?(I=(Ct=i.floatProperties)==null?void 0:Ct._OutlineLightingMix)!=null?I:1:0,Ro=(ft=i.textureProperties)==null?void 0:ft._UvAnimMaskTexture,zl=Ro!=null?{index:Ro,extensions:Wn({},Q)}:void 0,Gl=(De=(ke=i.floatProperties)==null?void 0:ke._UvAnimScrollX)!=null?De:0,pr=(pt=(ve=i.floatProperties)==null?void 0:ve._UvAnimScrollY)!=null?pt:0;pr!=null&&(pr=-pr);let x=(ze=(ye=i.floatProperties)==null?void 0:ye._UvAnimRotation)!=null?ze:0,N={specVersion:"1.0",transparentWithZWrite:R,renderQueueOffsetNumber:v,shadeColorFactor:te,shadeMultiplyTexture:de,shadingShiftFactor:J,shadingToonyFactor:Y,giEqualizationFactor:He,matcapFactor:Ke,matcapTexture:Sn,rimLightingMixFactor:hn,rimMultiplyTexture:$n,parametricRimColorFactor:_s,parametricRimFresnelPowerFactor:So,parametricRimLiftFactor:To,outlineWidthMode:dr,outlineWidthFactor:fr,outlineWidthMultiplyTexture:wo,outlineColorFactor:Ao,outlineLightingMixFactor:Vl,uvAnimationMaskTexture:zl,uvAnimationScrollXSpeedFactor:Gl,uvAnimationScrollYSpeedFactor:pr,uvAnimationRotationSpeedFactor:x};return cp(Wn({},e),{pbrMetallicRoughness:{baseColorFactor:Ee,baseColorTexture:ee},normalTexture:Se,emissiveTexture:D,emissiveFactor:le,alphaMode:W,alphaCutoff:$,doubleSided:we,extensions:{VRMC_materials_mtoon:N}})}_parseV0UnlitProperties(i,e){var t,n,r,s,o;let a=i.shader==="VRM/UnlitTransparentZWrite",l=i.shader==="VRM/UnlitTransparent"||a,c=this._v0ParseRenderQueue(i),u=i.shader==="VRM/UnlitCutout",h=l?"BLEND":u?"MASK":"OPAQUE",d=u?(n=(t=i.floatProperties)==null?void 0:t._Cutoff)!=null?n:.5:void 0,f=this._portTextureTransform(i),g=((s=(r=i.vectorProperties)==null?void 0:r._Color)!=null?s:[1,1,1,1]).map(is),_=(o=i.textureProperties)==null?void 0:o._MainTex,m=_!=null?{index:_,extensions:Wn({},f)}:void 0,p={specVersion:"1.0",transparentWithZWrite:a,renderQueueOffsetNumber:c,shadeColorFactor:g,shadeMultiplyTexture:m};return cp(Wn({},e),{pbrMetallicRoughness:{baseColorFactor:g,baseColorTexture:m},alphaMode:h,alphaCutoff:d,extensions:{VRMC_materials_mtoon:p}})}_portTextureTransform(i){var e,t,n,r,s;let o=(e=i.vectorProperties)==null?void 0:e._MainTex;if(o==null)return{};let a=[(t=o?.[0])!=null?t:0,(n=o?.[1])!=null?n:0],l=[(r=o?.[2])!=null?r:1,(s=o?.[3])!=null?s:1];return a[1]=1-l[1]-a[1],{KHR_texture_transform:{offset:a,scale:l}}}_v0ParseRenderQueue(i){var e,t;let n=i.shader==="VRM/UnlitTransparentZWrite",r=((e=i.keywordMap)==null?void 0:e._ALPHABLEND_ON)!=null||i.shader==="VRM/UnlitTransparent"||n,s=((t=i.floatProperties)==null?void 0:t._ZWrite)===1||n,o=0;if(r){let a=i.renderQueue;a!=null&&(s?o=this._renderQueueMapTransparentZWrite.get(a):o=this._renderQueueMapTransparent.get(a))}return o}_populateRenderQueueMap(i){let e=new Set,t=new Set;i.forEach(n=>{var r,s;let o=n.shader==="VRM/UnlitTransparentZWrite",a=((r=n.keywordMap)==null?void 0:r._ALPHABLEND_ON)!=null||n.shader==="VRM/UnlitTransparent"||o,l=((s=n.floatProperties)==null?void 0:s._ZWrite)===1||o;if(a){let c=n.renderQueue;c!=null&&(l?t.add(c):e.add(c))}}),e.size>10&&console.warn(`VRMMaterialsV0CompatPlugin: This VRM uses ${e.size} render queues for Transparent materials while VRM 1.0 only supports up to 10 render queues. The model might not be rendered correctly.`),t.size>10&&console.warn(`VRMMaterialsV0CompatPlugin: This VRM uses ${t.size} render queues for TransparentZWrite materials while VRM 1.0 only supports up to 10 render queues. The model might not be rendered correctly.`),Array.from(e).sort().forEach((n,r)=>{let s=Math.min(Math.max(r-e.size+1,-9),0);this._renderQueueMapTransparent.set(n,s)}),Array.from(t).sort().forEach((n,r)=>{let s=Math.min(Math.max(r,0),9);this._renderQueueMapTransparentZWrite.set(n,s)})}},up=(i,e,t)=>new Promise((n,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?n(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(i,e)).next())}),Ci=new S,qu=class extends _t{constructor(i){super(),this._attrPosition=new Be(new Float32Array([0,0,0,0,0,0]),3),this._attrPosition.setUsage(zc);let e=new tt;e.setAttribute("position",this._attrPosition);let t=new qt({color:16711935,depthTest:!1,depthWrite:!1});this._line=new ai(e,t),this.add(this._line),this.constraint=i}updateMatrixWorld(i){Ci.setFromMatrixPosition(this.constraint.destination.matrixWorld),this._attrPosition.setXYZ(0,Ci.x,Ci.y,Ci.z),this.constraint.source&&Ci.setFromMatrixPosition(this.constraint.source.matrixWorld),this._attrPosition.setXYZ(1,Ci.x,Ci.y,Ci.z),this._attrPosition.needsUpdate=!0,super.updateMatrixWorld(i)}};function hp(i,e){return e.set(i.elements[12],i.elements[13],i.elements[14])}var UM=new S,OM=new S;function FM(i,e){return i.decompose(UM,e,OM),e}function Cl(i){return i.invert?i.invert():i.inverse(),i}var ah=class{constructor(i,e){this.destination=i,this.source=e,this.weight=1}},BM=new S,kM=new S,HM=new S,VM=new ie,zM=new ie,GM=new ie,WM=class extends ah{get aimAxis(){return this._aimAxis}set aimAxis(i){this._aimAxis=i,this._v3AimAxis.set(i==="PositiveX"?1:i==="NegativeX"?-1:0,i==="PositiveY"?1:i==="NegativeY"?-1:0,i==="PositiveZ"?1:i==="NegativeZ"?-1:0)}get dependencies(){let i=new Set([this.source]);return this.destination.parent&&i.add(this.destination.parent),i}constructor(i,e){super(i,e),this._aimAxis="PositiveX",this._v3AimAxis=new S(1,0,0),this._dstRestQuat=new ie}setInitState(){this._dstRestQuat.copy(this.destination.quaternion)}update(){this.destination.updateWorldMatrix(!0,!1),this.source.updateWorldMatrix(!0,!1);let i=VM.identity(),e=zM.identity();this.destination.parent&&(FM(this.destination.parent.matrixWorld,i),Cl(e.copy(i)));let t=BM.copy(this._v3AimAxis).applyQuaternion(this._dstRestQuat).applyQuaternion(i),n=hp(this.source.matrixWorld,kM).sub(hp(this.destination.matrixWorld,HM)).normalize(),r=GM.setFromUnitVectors(t,n).premultiply(e).multiply(i).multiply(this._dstRestQuat);this.destination.quaternion.copy(this._dstRestQuat).slerp(r,this.weight)}};function XM(i,e){let t=[i],n=i.parent;for(;n!==null;)t.unshift(n),n=n.parent;t.forEach(r=>{e(r)})}var qM=class{constructor(){this._constraints=new Set,this._objectConstraintsMap=new Map}get constraints(){return this._constraints}addConstraint(i){this._constraints.add(i);let e=this._objectConstraintsMap.get(i.destination);e==null&&(e=new Set,this._objectConstraintsMap.set(i.destination,e)),e.add(i)}deleteConstraint(i){this._constraints.delete(i),this._objectConstraintsMap.get(i.destination).delete(i)}setInitState(){let i=new Set,e=new Set;for(let t of this._constraints)this._processConstraint(t,i,e,n=>n.setInitState())}update(){let i=new Set,e=new Set;for(let t of this._constraints)this._processConstraint(t,i,e,n=>n.update())}_processConstraint(i,e,t,n){if(t.has(i))return;if(e.has(i))throw new Error("VRMNodeConstraintManager: Circular dependency detected while updating constraints");e.add(i);let r=i.dependencies;for(let s of r)XM(s,o=>{let a=this._objectConstraintsMap.get(o);if(a)for(let l of a)this._processConstraint(l,e,t,n)});n(i),t.add(i)}},YM=new ie,jM=new ie,ZM=class extends ah{get dependencies(){return new Set([this.source])}constructor(i,e){super(i,e),this._dstRestQuat=new ie,this._invSrcRestQuat=new ie}setInitState(){this._dstRestQuat.copy(this.destination.quaternion),Cl(this._invSrcRestQuat.copy(this.source.quaternion))}update(){let i=YM.copy(this._invSrcRestQuat).multiply(this.source.quaternion),e=jM.copy(this._dstRestQuat).multiply(i);this.destination.quaternion.copy(this._dstRestQuat).slerp(e,this.weight)}},$M=new S,JM=new ie,KM=new ie,QM=class extends ah{get rollAxis(){return this._rollAxis}set rollAxis(i){this._rollAxis=i,this._v3RollAxis.set(i==="X"?1:0,i==="Y"?1:0,i==="Z"?1:0)}get dependencies(){return new Set([this.source])}constructor(i,e){super(i,e),this._rollAxis="X",this._v3RollAxis=new S(1,0,0),this._dstRestQuat=new ie,this._invDstRestQuat=new ie,this._invSrcRestQuatMulDstRestQuat=new ie}setInitState(){this._dstRestQuat.copy(this.destination.quaternion),Cl(this._invDstRestQuat.copy(this._dstRestQuat)),Cl(this._invSrcRestQuatMulDstRestQuat.copy(this.source.quaternion)).multiply(this._dstRestQuat)}update(){let i=JM.copy(this._invDstRestQuat).multiply(this.source.quaternion).multiply(this._invSrcRestQuatMulDstRestQuat),e=$M.copy(this._v3RollAxis).applyQuaternion(i),n=KM.setFromUnitVectors(e,this._v3RollAxis).premultiply(this._dstRestQuat).multiply(i);this.destination.quaternion.copy(this._dstRestQuat).slerp(n,this.weight)}},eE=new Set(["1.0","1.0-beta"]),Dp=class vo{get name(){return vo.EXTENSION_NAME}constructor(e,t){this.parser=e,this.helperRoot=t?.helperRoot}afterRoot(e){return up(this,null,function*(){e.userData.vrmNodeConstraintManager=yield this._import(e)})}_import(e){return up(this,null,function*(){var t;let n=this.parser.json;if(!(((t=n.extensionsUsed)==null?void 0:t.indexOf(vo.EXTENSION_NAME))!==-1))return null;let s=new qM,o=yield this.parser.getDependencies("node");return o.forEach((a,l)=>{var c;let u=n.nodes[l],h=(c=u?.extensions)==null?void 0:c[vo.EXTENSION_NAME];if(h==null)return;let d=h.specVersion;if(!eE.has(d)){console.warn(`VRMNodeConstraintLoaderPlugin: Unknown ${vo.EXTENSION_NAME} specVersion "${d}"`);return}let f=h.constraint;if(f.roll!=null){let g=this._importRollConstraint(a,o,f.roll);s.addConstraint(g)}else if(f.aim!=null){let g=this._importAimConstraint(a,o,f.aim);s.addConstraint(g)}else if(f.rotation!=null){let g=this._importRotationConstraint(a,o,f.rotation);s.addConstraint(g)}}),e.scene.updateMatrixWorld(),s.setInitState(),s})}_importRollConstraint(e,t,n){let{source:r,rollAxis:s,weight:o}=n,a=t[r],l=new QM(e,a);if(s!=null&&(l.rollAxis=s),o!=null&&(l.weight=o),this.helperRoot){let c=new qu(l);this.helperRoot.add(c)}return l}_importAimConstraint(e,t,n){let{source:r,aimAxis:s,weight:o}=n,a=t[r],l=new WM(e,a);if(s!=null&&(l.aimAxis=s),o!=null&&(l.weight=o),this.helperRoot){let c=new qu(l);this.helperRoot.add(c)}return l}_importRotationConstraint(e,t,n){let{source:r,weight:s}=n,o=t[r],a=new ZM(e,o);if(s!=null&&(a.weight=s),this.helperRoot){let l=new qu(a);this.helperRoot.add(l)}return a}};Dp.EXTENSION_NAME="VRMC_node_constraint";var tE=Dp,Sl=(i,e,t)=>new Promise((n,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?n(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(i,e)).next())}),lh=class{},Yu=new S,cr=new S,Np=class extends lh{get type(){return"capsule"}constructor(i){var e,t,n,r;super(),this.offset=(e=i?.offset)!=null?e:new S(0,0,0),this.tail=(t=i?.tail)!=null?t:new S(0,0,0),this.radius=(n=i?.radius)!=null?n:0,this.inside=(r=i?.inside)!=null?r:!1}calculateCollision(i,e,t,n){Yu.setFromMatrixPosition(i),cr.subVectors(this.tail,this.offset).applyMatrix4(i),cr.sub(Yu);let r=cr.lengthSq();n.copy(e).sub(Yu);let s=cr.dot(n);s<=0||(r<=s||cr.multiplyScalar(s/r),n.sub(cr));let o=n.length(),a=this.inside?this.radius-t-o:o-t-this.radius;return a<0&&(n.multiplyScalar(1/o),this.inside&&n.negate()),a}},ju=new S,dp=new Re,Up=class extends lh{get type(){return"plane"}constructor(i){var e,t;super(),this.offset=(e=i?.offset)!=null?e:new S(0,0,0),this.normal=(t=i?.normal)!=null?t:new S(0,0,1)}calculateCollision(i,e,t,n){n.setFromMatrixPosition(i),n.negate().add(e),dp.getNormalMatrix(i),ju.copy(this.normal).applyNormalMatrix(dp).normalize();let r=n.dot(ju)-t;return n.copy(ju),r}},nE=new S,Op=class extends lh{get type(){return"sphere"}constructor(i){var e,t,n;super(),this.offset=(e=i?.offset)!=null?e:new S(0,0,0),this.radius=(t=i?.radius)!=null?t:0,this.inside=(n=i?.inside)!=null?n:!1}calculateCollision(i,e,t,n){n.subVectors(e,nE.setFromMatrixPosition(i));let r=n.length(),s=this.inside?this.radius-t-r:r-t-this.radius;return s<0&&(n.multiplyScalar(1/r),this.inside&&n.negate()),s}},Xn=new S,iE=class extends tt{constructor(i){super(),this.worldScale=1,this._currentRadius=0,this._currentOffset=new S,this._currentTail=new S,this._shape=i,this._attrPos=new Be(new Float32Array(396),3),this.setAttribute("position",this._attrPos),this._attrIndex=new Be(new Uint16Array(264),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let i=!1,e=this._shape.radius/this.worldScale;this._currentRadius!==e&&(this._currentRadius=e,i=!0),this._currentOffset.equals(this._shape.offset)||(this._currentOffset.copy(this._shape.offset),i=!0);let t=Xn.copy(this._shape.tail).divideScalar(this.worldScale);this._currentTail.distanceToSquared(t)>1e-10&&(this._currentTail.copy(t),i=!0),i&&this._buildPosition()}_buildPosition(){Xn.copy(this._currentTail).sub(this._currentOffset);let i=Xn.length()/this._currentRadius;for(let n=0;n<=16;n++){let r=n/16*Math.PI;this._attrPos.setXYZ(n,-Math.sin(r),-Math.cos(r),0),this._attrPos.setXYZ(17+n,i+Math.sin(r),Math.cos(r),0),this._attrPos.setXYZ(34+n,-Math.sin(r),0,-Math.cos(r)),this._attrPos.setXYZ(51+n,i+Math.sin(r),0,Math.cos(r))}for(let n=0;n<32;n++){let r=n/16*Math.PI;this._attrPos.setXYZ(68+n,0,Math.sin(r),Math.cos(r)),this._attrPos.setXYZ(100+n,i,Math.sin(r),Math.cos(r))}let e=Math.atan2(Xn.y,Math.sqrt(Xn.x*Xn.x+Xn.z*Xn.z)),t=-Math.atan2(Xn.z,Xn.x);this.rotateZ(e),this.rotateY(t),this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentOffset.x,this._currentOffset.y,this._currentOffset.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let i=0;i<34;i++){let e=(i+1)%34;this._attrIndex.setXY(i*2,i,e),this._attrIndex.setXY(68+i*2,34+i,34+e)}for(let i=0;i<32;i++){let e=(i+1)%32;this._attrIndex.setXY(136+i*2,68+i,68+e),this._attrIndex.setXY(200+i*2,100+i,100+e)}this._attrIndex.needsUpdate=!0}},rE=class extends tt{constructor(i){super(),this.worldScale=1,this._currentOffset=new S,this._currentNormal=new S,this._shape=i,this._attrPos=new Be(new Float32Array(18),3),this.setAttribute("position",this._attrPos),this._attrIndex=new Be(new Uint16Array(10),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let i=!1;this._currentOffset.equals(this._shape.offset)||(this._currentOffset.copy(this._shape.offset),i=!0),this._currentNormal.equals(this._shape.normal)||(this._currentNormal.copy(this._shape.normal),i=!0),i&&this._buildPosition()}_buildPosition(){this._attrPos.setXYZ(0,-.5,-.5,0),this._attrPos.setXYZ(1,.5,-.5,0),this._attrPos.setXYZ(2,.5,.5,0),this._attrPos.setXYZ(3,-.5,.5,0),this._attrPos.setXYZ(4,0,0,0),this._attrPos.setXYZ(5,0,0,.25),this.translate(this._currentOffset.x,this._currentOffset.y,this._currentOffset.z),this.lookAt(this._currentNormal),this._attrPos.needsUpdate=!0}_buildIndex(){this._attrIndex.setXY(0,0,1),this._attrIndex.setXY(2,1,2),this._attrIndex.setXY(4,2,3),this._attrIndex.setXY(6,3,0),this._attrIndex.setXY(8,4,5),this._attrIndex.needsUpdate=!0}},sE=class extends tt{constructor(i){super(),this.worldScale=1,this._currentRadius=0,this._currentOffset=new S,this._shape=i,this._attrPos=new Be(new Float32Array(288),3),this.setAttribute("position",this._attrPos),this._attrIndex=new Be(new Uint16Array(192),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let i=!1,e=this._shape.radius/this.worldScale;this._currentRadius!==e&&(this._currentRadius=e,i=!0),this._currentOffset.equals(this._shape.offset)||(this._currentOffset.copy(this._shape.offset),i=!0),i&&this._buildPosition()}_buildPosition(){for(let i=0;i<32;i++){let e=i/16*Math.PI;this._attrPos.setXYZ(i,Math.cos(e),Math.sin(e),0),this._attrPos.setXYZ(32+i,0,Math.cos(e),Math.sin(e)),this._attrPos.setXYZ(64+i,Math.sin(e),0,Math.cos(e))}this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentOffset.x,this._currentOffset.y,this._currentOffset.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let i=0;i<32;i++){let e=(i+1)%32;this._attrIndex.setXY(i*2,i,e),this._attrIndex.setXY(64+i*2,32+i,32+e),this._attrIndex.setXY(128+i*2,64+i,64+e)}this._attrIndex.needsUpdate=!0}},oE=new S,Zu=class extends _t{constructor(i){if(super(),this.matrixAutoUpdate=!1,this.collider=i,this.collider.shape instanceof Op)this._geometry=new sE(this.collider.shape);else if(this.collider.shape instanceof Np)this._geometry=new iE(this.collider.shape);else if(this.collider.shape instanceof Up)this._geometry=new rE(this.collider.shape);else throw new Error("VRMSpringBoneColliderHelper: Unknown collider shape type detected");let e=new qt({color:16711935,depthTest:!1,depthWrite:!1});this._line=new gn(this._geometry,e),this.add(this._line)}dispose(){this._geometry.dispose()}updateMatrixWorld(i){this.collider.updateWorldMatrix(!0,!1),this.matrix.copy(this.collider.matrixWorld);let e=this.matrix.elements;this._geometry.worldScale=oE.set(e[0],e[1],e[2]).length(),this._geometry.update(),super.updateMatrixWorld(i)}},aE=class extends tt{constructor(i){super(),this.worldScale=1,this._currentRadius=0,this._currentTail=new S,this._springBone=i,this._attrPos=new Be(new Float32Array(294),3),this.setAttribute("position",this._attrPos),this._attrIndex=new Be(new Uint16Array(194),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let i=!1,e=this._springBone.settings.hitRadius/this.worldScale;this._currentRadius!==e&&(this._currentRadius=e,i=!0),this._currentTail.equals(this._springBone.initialLocalChildPosition)||(this._currentTail.copy(this._springBone.initialLocalChildPosition),i=!0),i&&this._buildPosition()}_buildPosition(){for(let i=0;i<32;i++){let e=i/16*Math.PI;this._attrPos.setXYZ(i,Math.cos(e),Math.sin(e),0),this._attrPos.setXYZ(32+i,0,Math.cos(e),Math.sin(e)),this._attrPos.setXYZ(64+i,Math.sin(e),0,Math.cos(e))}this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.setXYZ(96,0,0,0),this._attrPos.setXYZ(97,this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let i=0;i<32;i++){let e=(i+1)%32;this._attrIndex.setXY(i*2,i,e),this._attrIndex.setXY(64+i*2,32+i,32+e),this._attrIndex.setXY(128+i*2,64+i,64+e)}this._attrIndex.setXY(192,96,97),this._attrIndex.needsUpdate=!0}},lE=new S,cE=class extends _t{constructor(i){super(),this.matrixAutoUpdate=!1,this.springBone=i,this._geometry=new aE(this.springBone);let e=new qt({color:16776960,depthTest:!1,depthWrite:!1});this._line=new gn(this._geometry,e),this.add(this._line)}dispose(){this._geometry.dispose()}updateMatrixWorld(i){this.springBone.bone.updateWorldMatrix(!0,!1),this.matrix.copy(this.springBone.bone.matrixWorld);let e=this.matrix.elements;this._geometry.worldScale=lE.set(e[0],e[1],e[2]).length(),this._geometry.update(),super.updateMatrixWorld(i)}},$u=class extends $e{constructor(i){super(),this.colliderMatrix=new Me,this.shape=i}updateWorldMatrix(i,e){super.updateWorldMatrix(i,e),uE(this.colliderMatrix,this.matrixWorld,this.shape.offset)}};function uE(i,e,t){let n=e.elements;i.copy(e),t&&(i.elements[12]=n[0]*t.x+n[4]*t.y+n[8]*t.z+n[12],i.elements[13]=n[1]*t.x+n[5]*t.y+n[9]*t.z+n[13],i.elements[14]=n[2]*t.x+n[6]*t.y+n[10]*t.z+n[14])}var hE=new Me;function dE(i){return i.invert?i.invert():i.getInverse(hE.copy(i)),i}var fE=class{constructor(i){this._inverseCache=new Me,this._shouldUpdateInverse=!0,this.matrix=i;let e={set:(t,n,r)=>(this._shouldUpdateInverse=!0,t[n]=r,!0)};this._originalElements=i.elements,i.elements=new Proxy(i.elements,e)}get inverse(){return this._shouldUpdateInverse&&(dE(this._inverseCache.copy(this.matrix)),this._shouldUpdateInverse=!1),this._inverseCache}revert(){this.matrix.elements=this._originalElements}},Ju=new Me,rs=new S,mo=new S,go=new S,_o=new S,pE=new Me,mE=class{constructor(i,e,t={},n=[]){this._currentTail=new S,this._prevTail=new S,this._boneAxis=new S,this._worldSpaceBoneLength=0,this._center=null,this._initialLocalMatrix=new Me,this._initialLocalRotation=new ie,this._initialLocalChildPosition=new S;var r,s,o,a,l,c;this.bone=i,this.bone.matrixAutoUpdate=!1,this.child=e,this.settings={hitRadius:(r=t.hitRadius)!=null?r:0,stiffness:(s=t.stiffness)!=null?s:1,gravityPower:(o=t.gravityPower)!=null?o:0,gravityDir:(l=(a=t.gravityDir)==null?void 0:a.clone())!=null?l:new S(0,-1,0),dragForce:(c=t.dragForce)!=null?c:.4},this.colliderGroups=n}get dependencies(){let i=new Set,e=this.bone.parent;e&&i.add(e);for(let t=0;t<this.colliderGroups.length;t++)for(let n=0;n<this.colliderGroups[t].colliders.length;n++)i.add(this.colliderGroups[t].colliders[n]);return i}get center(){return this._center}set center(i){var e;(e=this._center)!=null&&e.userData.inverseCacheProxy&&(this._center.userData.inverseCacheProxy.revert(),delete this._center.userData.inverseCacheProxy),this._center=i,this._center&&(this._center.userData.inverseCacheProxy||(this._center.userData.inverseCacheProxy=new fE(this._center.matrixWorld)))}get initialLocalChildPosition(){return this._initialLocalChildPosition}get _parentMatrixWorld(){return this.bone.parent?this.bone.parent.matrixWorld:Ju}setInitState(){this._initialLocalMatrix.copy(this.bone.matrix),this._initialLocalRotation.copy(this.bone.quaternion),this.child?this._initialLocalChildPosition.copy(this.child.position):this._initialLocalChildPosition.copy(this.bone.position).normalize().multiplyScalar(.07);let i=this._getMatrixWorldToCenter();this.bone.localToWorld(this._currentTail.copy(this._initialLocalChildPosition)).applyMatrix4(i),this._prevTail.copy(this._currentTail),this._boneAxis.copy(this._initialLocalChildPosition).normalize()}reset(){this.bone.quaternion.copy(this._initialLocalRotation),this.bone.updateMatrix(),this.bone.matrixWorld.multiplyMatrices(this._parentMatrixWorld,this.bone.matrix);let i=this._getMatrixWorldToCenter();this.bone.localToWorld(this._currentTail.copy(this._initialLocalChildPosition)).applyMatrix4(i),this._prevTail.copy(this._currentTail)}update(i){if(i<=0)return;this._calcWorldSpaceBoneLength();let e=mo.copy(this._boneAxis).transformDirection(this._initialLocalMatrix).transformDirection(this._parentMatrixWorld);_o.copy(this._currentTail).add(rs.subVectors(this._currentTail,this._prevTail).multiplyScalar(1-this.settings.dragForce)).applyMatrix4(this._getMatrixCenterToWorld()).addScaledVector(e,this.settings.stiffness*i).addScaledVector(this.settings.gravityDir,this.settings.gravityPower*i),go.setFromMatrixPosition(this.bone.matrixWorld),_o.sub(go).normalize().multiplyScalar(this._worldSpaceBoneLength).add(go),this._collision(_o),this._prevTail.copy(this._currentTail),this._currentTail.copy(_o).applyMatrix4(this._getMatrixWorldToCenter());let t=pE.multiplyMatrices(this._parentMatrixWorld,this._initialLocalMatrix).invert();this.bone.quaternion.setFromUnitVectors(this._boneAxis,rs.copy(_o).applyMatrix4(t).normalize()).premultiply(this._initialLocalRotation),this.bone.updateMatrix(),this.bone.matrixWorld.multiplyMatrices(this._parentMatrixWorld,this.bone.matrix)}_collision(i){for(let e=0;e<this.colliderGroups.length;e++)for(let t=0;t<this.colliderGroups[e].colliders.length;t++){let n=this.colliderGroups[e].colliders[t],r=n.shape.calculateCollision(n.colliderMatrix,i,this.settings.hitRadius,rs);if(r<0){i.addScaledVector(rs,-r),i.sub(go);let s=i.length();i.multiplyScalar(this._worldSpaceBoneLength/s).add(go)}}}_calcWorldSpaceBoneLength(){rs.setFromMatrixPosition(this.bone.matrixWorld),this.child?mo.setFromMatrixPosition(this.child.matrixWorld):(mo.copy(this._initialLocalChildPosition),mo.applyMatrix4(this.bone.matrixWorld)),this._worldSpaceBoneLength=rs.sub(mo).length()}_getMatrixCenterToWorld(){return this._center?this._center.matrixWorld:Ju}_getMatrixWorldToCenter(){return this._center?this._center.userData.inverseCacheProxy.inverse:Ju}};function gE(i,e){let t=[],n=i;for(;n!==null;)t.unshift(n),n=n.parent;t.forEach(r=>{e(r)})}function rh(i,e){i.children.forEach(t=>{e(t)||rh(t,e)})}function _E(i){var e;let t=new Map;for(let n of i){let r=n;do{let s=((e=t.get(r))!=null?e:0)+1;if(s===i.size)return r;t.set(r,s),r=r.parent}while(r!==null)}return null}var fp=class{constructor(){this._joints=new Set,this._sortedJoints=[],this._hasWarnedCircularDependency=!1,this._ancestors=[],this._objectSpringBonesMap=new Map,this._isSortedJointsDirty=!1,this._relevantChildrenUpdated=this._relevantChildrenUpdated.bind(this)}get joints(){return this._joints}get springBones(){return console.warn("VRMSpringBoneManager: springBones is deprecated. use joints instead."),this._joints}get colliderGroups(){let i=new Set;return this._joints.forEach(e=>{e.colliderGroups.forEach(t=>{i.add(t)})}),Array.from(i)}get colliders(){let i=new Set;return this.colliderGroups.forEach(e=>{e.colliders.forEach(t=>{i.add(t)})}),Array.from(i)}addJoint(i){this._joints.add(i);let e=this._objectSpringBonesMap.get(i.bone);e==null&&(e=new Set,this._objectSpringBonesMap.set(i.bone,e)),e.add(i),this._isSortedJointsDirty=!0}addSpringBone(i){console.warn("VRMSpringBoneManager: addSpringBone() is deprecated. use addJoint() instead."),this.addJoint(i)}deleteJoint(i){this._joints.delete(i),this._objectSpringBonesMap.get(i.bone).delete(i),this._isSortedJointsDirty=!0}deleteSpringBone(i){console.warn("VRMSpringBoneManager: deleteSpringBone() is deprecated. use deleteJoint() instead."),this.deleteJoint(i)}setInitState(){this._sortJoints();for(let i=0;i<this._sortedJoints.length;i++){let e=this._sortedJoints[i];e.bone.updateMatrix(),e.bone.updateWorldMatrix(!1,!1),e.setInitState()}}reset(){this._sortJoints();for(let i=0;i<this._sortedJoints.length;i++){let e=this._sortedJoints[i];e.bone.updateMatrix(),e.bone.updateWorldMatrix(!1,!1),e.reset()}}update(i){this._sortJoints();for(let e=0;e<this._ancestors.length;e++)this._ancestors[e].updateWorldMatrix(e===0,!1);for(let e=0;e<this._sortedJoints.length;e++){let t=this._sortedJoints[e];t.bone.updateMatrix(),t.bone.updateWorldMatrix(!1,!1),t.update(i),rh(t.bone,this._relevantChildrenUpdated)}}_sortJoints(){if(!this._isSortedJointsDirty)return;let i=[],e=new Set,t=new Set,n=new Set;for(let s of this._joints)this._insertJointSort(s,e,t,i,n);this._sortedJoints=i;let r=_E(n);this._ancestors=[],r&&(this._ancestors.push(r),rh(r,s=>{var o,a;return((a=(o=this._objectSpringBonesMap.get(s))==null?void 0:o.size)!=null?a:0)>0?!0:(this._ancestors.push(s),!1)})),this._isSortedJointsDirty=!1}_insertJointSort(i,e,t,n,r){if(t.has(i))return;if(e.has(i)){this._hasWarnedCircularDependency||(console.warn("VRMSpringBoneManager: Circular dependency detected"),this._hasWarnedCircularDependency=!0);return}e.add(i);let s=i.dependencies;for(let o of s){let a=!1,l=null;gE(o,c=>{let u=this._objectSpringBonesMap.get(c);if(u)for(let h of u)a=!0,this._insertJointSort(h,e,t,n,r);else a||(l=c)}),l&&r.add(l)}n.push(i),t.add(i)}_relevantChildrenUpdated(i){var e,t;return((t=(e=this._objectSpringBonesMap.get(i))==null?void 0:e.size)!=null?t:0)>0?!0:(i.updateWorldMatrix(!1,!1),!1)}},pp="VRMC_springBone_extended_collider",vE=new Set(["1.0","1.0-beta"]),yE=new Set(["1.0"]),Fp=class os{get name(){return os.EXTENSION_NAME}constructor(e,t){var n;this.parser=e,this.jointHelperRoot=t?.jointHelperRoot,this.colliderHelperRoot=t?.colliderHelperRoot,this.useExtendedColliders=(n=t?.useExtendedColliders)!=null?n:!0}afterRoot(e){return Sl(this,null,function*(){e.userData.vrmSpringBoneManager=yield this._import(e)})}_import(e){return Sl(this,null,function*(){let t=yield this._v1Import(e);if(t!=null)return t;let n=yield this._v0Import(e);return n??null})}_v1Import(e){return Sl(this,null,function*(){var t,n,r,s,o;let a=e.parser.json;if(!(((t=a.extensionsUsed)==null?void 0:t.indexOf(os.EXTENSION_NAME))!==-1))return null;let c=new fp,u=yield e.parser.getDependencies("node"),h=(n=a.extensions)==null?void 0:n[os.EXTENSION_NAME];if(!h)return null;let d=h.specVersion;if(!vE.has(d))return console.warn(`VRMSpringBoneLoaderPlugin: Unknown ${os.EXTENSION_NAME} specVersion "${d}"`),null;let f=(r=h.colliders)==null?void 0:r.map((_,m)=>{var p,T,b,y,A,w,C,L,E,M,P,F,V,X,j;let z=u[_.node];if(z==null)return console.warn(`VRMSpringBoneLoaderPlugin: The collider #${m} attempted to reference a node #${_.node} but not found. Skipping the collider`),null;let K=_.shape,H=(p=_.extensions)==null?void 0:p[pp];if(this.useExtendedColliders&&H!=null){let ae=H.specVersion;if(!yE.has(ae))console.warn(`VRMSpringBoneLoaderPlugin: Unknown ${pp} specVersion "${ae}". Fallbacking to the ${os.EXTENSION_NAME} definition`);else{let re=H.shape;if(re.sphere)return this._importSphereCollider(z,{offset:new S().fromArray((T=re.sphere.offset)!=null?T:[0,0,0]),radius:(b=re.sphere.radius)!=null?b:0,inside:(y=re.sphere.inside)!=null?y:!1});if(re.capsule)return this._importCapsuleCollider(z,{offset:new S().fromArray((A=re.capsule.offset)!=null?A:[0,0,0]),radius:(w=re.capsule.radius)!=null?w:0,tail:new S().fromArray((C=re.capsule.tail)!=null?C:[0,0,0]),inside:(L=re.capsule.inside)!=null?L:!1});if(re.plane)return this._importPlaneCollider(z,{offset:new S().fromArray((E=re.plane.offset)!=null?E:[0,0,0]),normal:new S().fromArray((M=re.plane.normal)!=null?M:[0,0,1])})}}if(K.sphere)return this._importSphereCollider(z,{offset:new S().fromArray((P=K.sphere.offset)!=null?P:[0,0,0]),radius:(F=K.sphere.radius)!=null?F:0,inside:!1});if(K.capsule)return this._importCapsuleCollider(z,{offset:new S().fromArray((V=K.capsule.offset)!=null?V:[0,0,0]),radius:(X=K.capsule.radius)!=null?X:0,tail:new S().fromArray((j=K.capsule.tail)!=null?j:[0,0,0]),inside:!1});console.warn(`VRMSpringBoneLoaderPlugin: The collider #${m} has no valid shape. Skipping the collider`)}),g=(s=h.colliderGroups)==null?void 0:s.map((_,m)=>{var p;return{colliders:((p=_.colliders)!=null?p:[]).map(b=>{let y=f?.[b];return y??(console.warn(`VRMSpringBoneLoaderPlugin: The collider group #${m} attempted to reference a collider #${b} but not found. Skipping the collider`),null)}).filter(b=>b!=null),name:_.name}});return(o=h.springs)==null||o.forEach((_,m)=>{var p;let T=_.joints,b=(p=_.colliderGroups)==null?void 0:p.map(w=>{let C=g?.[w];return C??(console.warn(`VRMSpringBoneLoaderPlugin: The spring #${m} attempted to reference a collider group #${w} but not found. Skipping the collider group`),null)}).filter(w=>w!=null),y=_.center!=null?u[_.center]:void 0,A;T.forEach(w=>{if(A){let C=A.node,L=u[C],E=w.node,M=u[E],P={hitRadius:A.hitRadius,dragForce:A.dragForce,gravityPower:A.gravityPower,stiffness:A.stiffness,gravityDir:A.gravityDir!=null?new S().fromArray(A.gravityDir):void 0},F=this._importJoint(L,M,P,b);y&&(F.center=y),c.addJoint(F)}A=w})}),c.setInitState(),c})}_v0Import(e){return Sl(this,null,function*(){var t,n,r;let s=e.parser.json;if(!(((t=s.extensionsUsed)==null?void 0:t.indexOf("VRM"))!==-1))return null;let a=(n=s.extensions)==null?void 0:n.VRM,l=a?.secondaryAnimation;if(!l)return null;let c=l?.boneGroups;if(!c)return null;let u=new fp,h=yield e.parser.getDependencies("node"),d=(r=l.colliderGroups)==null?void 0:r.map((f,g)=>{var _;let m=h[f.node];return m==null?(console.warn(`VRMSpringBoneLoaderPlugin: The collider group #${g} attempted to reference a node #${f.node} but not found. Skipping the collider group`),null):{colliders:((_=f.colliders)!=null?_:[]).map((T,b)=>{var y,A,w;let C=new S(0,0,0);return T.offset&&C.set((y=T.offset.x)!=null?y:0,(A=T.offset.y)!=null?A:0,T.offset.z?-T.offset.z:0),this._importSphereCollider(m,{offset:C,radius:(w=T.radius)!=null?w:0,inside:!1})})}});return c?.forEach((f,g)=>{let _=f.bones;_&&_.forEach(m=>{var p,T,b,y;let A=h[m];if(A==null){console.warn(`VRMSpringBoneLoaderPlugin: The spring bone group #${g} attempted to reference a node #${m} but not found. Skipping the node`);return}let w=new S;f.gravityDir?w.set((p=f.gravityDir.x)!=null?p:0,(T=f.gravityDir.y)!=null?T:0,(b=f.gravityDir.z)!=null?b:0):w.set(0,-1,0);let C=f.center!=null?h[f.center]:void 0,L={hitRadius:f.hitRadius,dragForce:f.dragForce,gravityPower:f.gravityPower,stiffness:f.stiffiness,gravityDir:w},E=(y=f.colliderGroups)==null?void 0:y.map(M=>{let P=d?.[M];return P??(console.warn(`VRMSpringBoneLoaderPlugin: The spring #${g} attempted to reference a collider group #${M} but not found. Skipping the collider group`),null)}).filter(M=>M!=null);A.traverse(M=>{var P;let F=(P=M.children[0])!=null?P:null,V=this._importJoint(M,F,L,E);C&&(V.center=C),u.addJoint(V)})})}),e.scene.updateMatrixWorld(),u.setInitState(),u})}_importJoint(e,t,n,r){let s=new mE(e,t,n,r);if(this.jointHelperRoot){let o=new cE(s);this.jointHelperRoot.add(o),o.renderOrder=this.jointHelperRoot.renderOrder}return s}_importSphereCollider(e,t){let n=new Op(t),r=new $u(n);if(e.add(r),this.colliderHelperRoot){let s=new Zu(r);this.colliderHelperRoot.add(s),s.renderOrder=this.colliderHelperRoot.renderOrder}return r}_importCapsuleCollider(e,t){let n=new Np(t),r=new $u(n);if(e.add(r),this.colliderHelperRoot){let s=new Zu(r);this.colliderHelperRoot.add(s),s.renderOrder=this.colliderHelperRoot.renderOrder}return r}_importPlaneCollider(e,t){let n=new Up(t),r=new $u(n);if(e.add(r),this.colliderHelperRoot){let s=new Zu(r);this.colliderHelperRoot.add(s),s.renderOrder=this.colliderHelperRoot.renderOrder}return r}};Fp.EXTENSION_NAME="VRMC_springBone";var xE=Fp,Bp=class{get name(){return"VRMLoaderPlugin"}constructor(i,e){var t,n,r,s,o,a,l,c,u,h;this.parser=i;let d=e?.helperRoot,f=e?.autoUpdateHumanBones;this.expressionPlugin=(t=e?.expressionPlugin)!=null?t:new B0(i),this.firstPersonPlugin=(n=e?.firstPersonPlugin)!=null?n:new H0(i),this.humanoidPlugin=(r=e?.humanoidPlugin)!=null?r:new Y0(i,{helperRoot:d,autoUpdateHumanBones:f}),this.lookAtPlugin=(s=e?.lookAtPlugin)!=null?s:new lM(i,{helperRoot:d}),this.metaPlugin=(o=e?.metaPlugin)!=null?o:new hM(i),this.mtoonMaterialPlugin=(a=e?.mtoonMaterialPlugin)!=null?a:new TM(i),this.materialsHDREmissiveMultiplierPlugin=(l=e?.materialsHDREmissiveMultiplierPlugin)!=null?l:new AM(i),this.materialsV0CompatPlugin=(c=e?.materialsV0CompatPlugin)!=null?c:new NM(i),this.springBonePlugin=(u=e?.springBonePlugin)!=null?u:new xE(i,{colliderHelperRoot:d,jointHelperRoot:d}),this.nodeConstraintPlugin=(h=e?.nodeConstraintPlugin)!=null?h:new tE(i,{helperRoot:d})}beforeRoot(){return Ml(this,null,function*(){yield this.materialsV0CompatPlugin.beforeRoot(),yield this.mtoonMaterialPlugin.beforeRoot()})}loadMesh(i){return Ml(this,null,function*(){return yield this.mtoonMaterialPlugin.loadMesh(i)})}getMaterialType(i){let e=this.mtoonMaterialPlugin.getMaterialType(i);return e??null}extendMaterialParams(i,e){return Ml(this,null,function*(){yield this.materialsHDREmissiveMultiplierPlugin.extendMaterialParams(i,e),yield this.mtoonMaterialPlugin.extendMaterialParams(i,e)})}afterRoot(i){return Ml(this,null,function*(){yield this.metaPlugin.afterRoot(i),yield this.humanoidPlugin.afterRoot(i),yield this.expressionPlugin.afterRoot(i),yield this.lookAtPlugin.afterRoot(i),yield this.firstPersonPlugin.afterRoot(i),yield this.springBonePlugin.afterRoot(i),yield this.nodeConstraintPlugin.afterRoot(i),yield this.mtoonMaterialPlugin.afterRoot(i);let e=i.userData.vrmMeta,t=i.userData.vrmHumanoid;if(e&&t){let n=new fM({scene:i.scene,expressionManager:i.userData.vrmExpressionManager,firstPerson:i.userData.vrmFirstPerson,humanoid:t,lookAt:i.userData.vrmLookAt,meta:e,materials:i.userData.vrmMToonMaterials,springBoneManager:i.userData.vrmSpringBoneManager,nodeConstraintManager:i.userData.vrmNodeConstraintManager});i.userData.vrm=n}})}};function ME(i){let e=new Set;return i.traverse(t=>{if(!t.isMesh)return;let n=t;e.add(n)}),e}function mp(i,e,t){if(e.size===1){let o=e.values().next().value;if(o.weight===1)return i[o.index]}let n=new Float32Array(i[0].count*3),r=0;if(t)r=1;else for(let o of e)r+=o.weight;for(let o of e){let a=i[o.index],l=o.weight/r;for(let c=0;c<a.count;c++)n[c*3+0]+=a.getX(c)*l,n[c*3+1]+=a.getY(c)*l,n[c*3+2]+=a.getZ(c)*l}return new Be(n,3)}function EE(i){var e;let t=ME(i.scene),n=new Map,r=(e=i.expressionManager)==null?void 0:e.expressionMap;if(r!=null)for(let[s,o]of Object.entries(r)){let a=new Set;for(let l of o.binds)if(l instanceof Rl){if(l.weight!==0)for(let c of l.primitives){let u=n.get(c);u==null&&(u=new Map,n.set(c,u));let h=u.get(s);h==null&&(h=new Set,u.set(s,h)),h.add(l)}a.add(l)}for(let l of a)o.deleteBind(l)}for(let s of t){let o=n.get(s);if(o==null)continue;let a=s.geometry.morphAttributes;s.geometry.morphAttributes={};let l=s.geometry.clone();s.geometry=l;let c=l.morphTargetsRelative,u=a.position!=null,h=a.normal!=null,d={},f={},g=[];if(u||h){u&&(d.position=[]),h&&(d.normal=[]);let _=0;for(let[m,p]of o)u&&(d.position[_]=mp(a.position,p,c)),h&&(d.normal[_]=mp(a.normal,p,c)),r?.[m].addBind(new Rl({index:_,weight:1,primitives:[s]})),f[m]=_,g.push(0),_++}l.morphAttributes=d,s.morphTargetDictionary=f,s.morphTargetInfluences=g}}function Pl(i,e,t){if(i.getComponent)return i.getComponent(e,t);{let n=i.array[e*i.itemSize+t];return i.normalized&&(n=Ne.denormalize(n,i.array)),n}}function kp(i,e,t,n){i.setComponent?i.setComponent(e,t,n):(i.normalized&&(n=Ne.normalize(n,i.array)),i.array[e*i.itemSize+t]=n)}function bE(i){var e;let t=SE(i),n=new Set;for(let h of t)n.has(h.geometry)&&(h.geometry=PE(h.geometry)),n.add(h.geometry);let r=new Map;for(let h of n){let d=h.getAttribute("skinIndex"),f=(e=r.get(d))!=null?e:new Map;r.set(d,f);let g=h.getAttribute("skinWeight"),_=TE(d,g);f.set(g,_)}let s=new Map;for(let h of t){let d=wE(h,r);s.set(h,d)}let o=[];for(let[h,d]of s){let f=!1;for(let g of o)if(AE(d,g.boneInverseMap)){f=!0,g.meshes.add(h);for(let[m,p]of d)g.boneInverseMap.set(m,p);break}f||o.push({boneInverseMap:d,meshes:new Set([h])})}let a=new Map,l=new Ku,c=new Ku,u=new Ku;for(let h of o){let{boneInverseMap:d,meshes:f}=h,g=Array.from(d.keys()),_=Array.from(d.values()),m=new an(g,_),p=c.getOrCreate(m);for(let T of f){let b=T.geometry.getAttribute("skinIndex"),y=l.getOrCreate(b),A=T.skeleton.bones,w=A.map(E=>u.getOrCreate(E)).join(","),C=`${y};${p};${w}`,L=a.get(C);L==null&&(L=b.clone(),RE(L,A,g),a.set(C,L)),T.geometry.setAttribute("skinIndex",L)}for(let T of f)T.bind(m,new Me)}}function SE(i){let e=new Set;return i.traverse(t=>{if(!t.isSkinnedMesh)return;let n=t;e.add(n)}),e}function TE(i,e){let t=new Set;for(let n=0;n<i.count;n++)for(let r=0;r<i.itemSize;r++){let s=Pl(i,n,r);Pl(e,n,r)!==0&&t.add(s)}return t}function wE(i,e){let t=new Map,n=i.skeleton,r=i.geometry,s=r.getAttribute("skinIndex"),o=r.getAttribute("skinWeight"),a=e.get(s),l=a?.get(o);if(!l)throw new Error("Unreachable. attributeUsedIndexSetMap does not know the skin index attribute or the skin weight attribute.");for(let c of l)t.set(n.bones[c],n.boneInverses[c]);return t}function AE(i,e){for(let[t,n]of i.entries()){let r=e.get(t);if(r!=null&&!CE(n,r))return!1}return!0}function RE(i,e,t){let n=new Map;for(let s of e)n.set(s,n.size);let r=new Map;for(let[s,o]of t.entries()){let a=n.get(o);r.set(a,s)}for(let s=0;s<i.count;s++)for(let o=0;o<i.itemSize;o++){let a=Pl(i,s,o),l=r.get(a);kp(i,s,o,l)}i.needsUpdate=!0}function CE(i,e,t){if(t=t||1e-4,i.elements.length!=e.elements.length)return!1;for(let n=0,r=i.elements.length;n<r;n++)if(Math.abs(i.elements[n]-e.elements[n])>t)return!1;return!0}var Ku=class{constructor(){this._objectIndexMap=new Map,this._index=0}get(i){return this._objectIndexMap.get(i)}getOrCreate(i){let e=this._objectIndexMap.get(i);return e==null&&(e=this._index,this._objectIndexMap.set(i,e),this._index++),e}};function PE(i){var e,t,n,r;let s=new tt;s.name=i.name,s.setIndex(i.index);for(let[o,a]of Object.entries(i.attributes))s.setAttribute(o,a);for(let[o,a]of Object.entries(i.morphAttributes)){let l=o;s.morphAttributes[l]=a.concat()}s.morphTargetsRelative=i.morphTargetsRelative,s.groups=[];for(let o of i.groups)s.addGroup(o.start,o.count,o.materialIndex);return s.boundingSphere=(t=(e=i.boundingSphere)==null?void 0:e.clone())!=null?t:null,s.boundingBox=(r=(n=i.boundingBox)==null?void 0:n.clone())!=null?r:null,s.drawRange.start=i.drawRange.start,s.drawRange.count=i.drawRange.count,s.userData=i.userData,s}function gp(i){if(Object.values(i).forEach(e=>{e?.isTexture&&e.dispose()}),i.isShaderMaterial){let e=i.uniforms;e&&Object.values(e).forEach(t=>{let n=t.value;n?.isTexture&&n.dispose()})}i.dispose()}function IE(i){let e=i.geometry;e&&e.dispose();let t=i.skeleton;t&&t.dispose();let n=i.material;n&&(Array.isArray(n)?n.forEach(r=>gp(r)):n&&gp(n))}function LE(i){i.traverse(IE)}function DE(i,e){var t,n;console.warn("VRMUtils.removeUnnecessaryJoints: removeUnnecessaryJoints is deprecated. Use combineSkeletons instead. combineSkeletons contributes more to the performance improvement. This function will be removed in the next major version.");let r=(t=e?.experimentalSameBoneCounts)!=null?t:!1,s=[];i.traverse(l=>{l.type==="SkinnedMesh"&&s.push(l)});let o=new Map,a=0;for(let l of s){let u=l.geometry.getAttribute("skinIndex");if(o.has(u))continue;let h=new Map,d=new Map;for(let f=0;f<u.count;f++)for(let g=0;g<u.itemSize;g++){let _=Pl(u,f,g),m=h.get(_);m==null&&(m=h.size,h.set(_,m),d.set(m,_)),kp(u,f,g,m)}u.needsUpdate=!0,o.set(u,d),a=Math.max(a,h.size)}for(let l of s){let u=l.geometry.getAttribute("skinIndex"),h=o.get(u),d=[],f=[],g=r?a:h.size;for(let m=0;m<g;m++){let p=(n=h.get(m))!=null?n:0;d.push(l.skeleton.bones[p]),f.push(l.skeleton.boneInverses[p])}let _=new an(d,f);l.bind(_,new Me)}}function NE(i,e){let t=i.position.count,n=new Array(t),r=0,s=e.array;for(let o=0;o<s.length;o++){let a=s[o];n[a]||(n[a]=!0,r++)}return{isVertexUsed:n,vertexCount:t,verticesUsed:r}}function UE(i){let e=[],t=[],n=0;for(let r=0;r<i.length;r++)if(i[r]){let s=n++;e[r]=s,t[s]=r}return{originalIndexNewIndexMap:e,newIndexOriginalIndexMap:t}}function OE(i,e){var t,n,r,s;e.name=i.name,e.morphTargetsRelative=i.morphTargetsRelative,i.groups.forEach(o=>{e.addGroup(o.start,o.count,o.materialIndex)}),e.boundingBox=(n=(t=i.boundingBox)==null?void 0:t.clone())!=null?n:null,e.boundingSphere=(s=(r=i.boundingSphere)==null?void 0:r.clone())!=null?s:null,e.setDrawRange(i.drawRange.start,i.drawRange.count),e.userData=i.userData}function FE(i,e,t){let n=e.array,r=new n.constructor(n.length);for(let s=0;s<n.length;s++){let o=n[s];r[s]=t[o]}i.setIndex(new Be(r,e.itemSize,e.normalized))}function Il(i,e,t){let n=i.constructor,r=new n(e.length*t),s=!0;for(let o=0;o<e.length;o++){let l=e[o]*t,c=o*t;for(let u=0;u<t;u++){let h=i[l+u];r[c+u]=h,s=s&&h===0}}return[r,s]}function BE(i){var e;let t=new Map,n=[];for(let[r,s]of Object.entries(i))if(s.isInterleavedBufferAttribute){let o=s,a=o.data,l=(e=t.get(a))!=null?e:[];t.set(a,l),l.push([r,o])}else{let o=s;n.push([r,o])}return[t,n]}function kE(i,e,t){let[n,r]=BE(e);for(let[s,o]of n){let a=s.array,{stride:l}=s,[c,u]=Il(a,t,l),h=new ri(c,l);h.setUsage(s.usage);for(let[d,f]of o){let{itemSize:g,offset:_,normalized:m}=f,p=new si(h,g,_,m);i.setAttribute(d,p)}}for(let[s,o]of r){let a=o.array,{itemSize:l,normalized:c}=o,[u,h]=Il(a,t,l);i.setAttribute(s,new Be(u,l,c))}}function HE(i){var e;let t=new Map,n=[];for(let[r,s]of Object.entries(i)){let o=r;for(let a=0;a<s.length;a++){let l=s[a];if(l.isInterleavedBufferAttribute){let c=l,u=c.data,h=(e=t.get(u))!=null?e:[];t.set(u,h),h.push([o,a,c])}else{let c=l;n.push([o,a,c])}}}return[t,n]}function VE(i,e,t){var n,r;let s=!0,[o,a]=HE(e),l={};for(let[c,u]of o){let h=c.array,{stride:d}=c,[f,g]=Il(h,t,d);s=s&&g;let _=new ri(f,d);_.setUsage(c.usage);for(let[m,p,T]of u){let{itemSize:b,offset:y,normalized:A}=T,w=new si(_,b,y,A);(n=l[m])!=null||(l[m]=[]),l[m][p]=w}}for(let[c,u,h]of a){let d=h,f=d.array,{itemSize:g,normalized:_}=d,[m,p]=Il(f,t,g);s=s&&p,(r=l[c])!=null||(l[c]=[]),l[c][u]=new Be(m,g,_)}i.morphAttributes=s?{}:l}function zE(i){let e=new Map;i.traverse(t=>{if(!t.isMesh)return;let n=t,r=n.geometry,s=r.index;if(s==null)return;let o=e.get(r);if(o!=null){n.geometry=o;return}let{isVertexUsed:a,vertexCount:l,verticesUsed:c}=NE(r.attributes,s);if(c===l)return;let{originalIndexNewIndexMap:u,newIndexOriginalIndexMap:h}=UE(a),d=new tt;OE(r,d),e.set(r,d),FE(d,s,u),kE(d,r.attributes,h),VE(d,r.morphAttributes,h),n.geometry=d}),Array.from(e.keys()).forEach(t=>{t.dispose()})}function GE(i){var e;((e=i.meta)==null?void 0:e.metaVersion)==="0"&&(i.scene.rotation.y=Math.PI)}var as=class{constructor(){}};as.combineMorphs=EE;as.combineSkeletons=bE;as.deepDispose=LE;as.removeUnnecessaryJoints=DE;as.removeUnnecessaryVertices=zE;as.rotateVRM0=GE;var Hp=(i,e,t)=>new Promise((n,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?n(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(i,e)).next())}),bn=(i,e,t)=>new Promise((n,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?n(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(i,e)).next())}),Vp=class extends $e{constructor(i){super(),this.weight=0,this.isBinary=!1,this.overrideBlink="none",this.overrideLookAt="none",this.overrideMouth="none",this._binds=[],this.name=`VRMExpression_${i}`,this.expressionName=i,this.type="VRMExpression",this.visible=!1}get binds(){return this._binds}get overrideBlinkAmount(){return this.overrideBlink==="block"?0<this.outputWeight?1:0:this.overrideBlink==="blend"?this.outputWeight:0}get overrideLookAtAmount(){return this.overrideLookAt==="block"?0<this.outputWeight?1:0:this.overrideLookAt==="blend"?this.outputWeight:0}get overrideMouthAmount(){return this.overrideMouth==="block"?0<this.outputWeight?1:0:this.overrideMouth==="blend"?this.outputWeight:0}get outputWeight(){return this.isBinary?this.weight>.5?1:0:this.weight}addBind(i){this._binds.push(i)}deleteBind(i){let e=this._binds.indexOf(i);e>=0&&this._binds.splice(e,1)}applyWeight(i){var e;let t=this.outputWeight;t*=(e=i?.multiplier)!=null?e:1,this.isBinary&&t<1&&(t=0),this._binds.forEach(n=>n.applyWeight(t))}clearAppliedWeight(){this._binds.forEach(i=>i.clearAppliedWeight())}};function WE(i,e,t){var n,r;let s=i.parser.json,o=(n=s.nodes)==null?void 0:n[e];if(o==null)return console.warn(`extractPrimitivesInternal: Attempt to use nodes[${e}] of glTF but the node doesn't exist`),null;let a=o.mesh;if(a==null)return null;let l=(r=s.meshes)==null?void 0:r[a];if(l==null)return console.warn(`extractPrimitivesInternal: Attempt to use meshes[${a}] of glTF but the mesh doesn't exist`),null;let c=l.primitives.length,u=[];return t.traverse(h=>{u.length<c&&h.isMesh&&u.push(h)}),u}function zp(i,e){return bn(this,null,function*(){let t=yield i.parser.getDependency("node",e);return WE(i,e,t)})}var Dl={Aa:"aa",Ih:"ih",Ou:"ou",Ee:"ee",Oh:"oh",Blink:"blink",Happy:"happy",Angry:"angry",Sad:"sad",Relaxed:"relaxed",LookUp:"lookUp",Surprised:"surprised",LookDown:"lookDown",LookLeft:"lookLeft",LookRight:"lookRight",BlinkLeft:"blinkLeft",BlinkRight:"blinkRight",Neutral:"neutral"};function XE(i){return Math.max(Math.min(i,1),0)}var Gp=class im{constructor(){this.blinkExpressionNames=["blink","blinkLeft","blinkRight"],this.lookAtExpressionNames=["lookLeft","lookRight","lookUp","lookDown"],this.mouthExpressionNames=["aa","ee","ih","oh","ou"],this._expressions=[],this._expressionMap={}}get expressions(){return this._expressions.concat()}get expressionMap(){return Object.assign({},this._expressionMap)}get presetExpressionMap(){let e={},t=new Set(Object.values(Dl));return Object.entries(this._expressionMap).forEach(([n,r])=>{t.has(n)&&(e[n]=r)}),e}get customExpressionMap(){let e={},t=new Set(Object.values(Dl));return Object.entries(this._expressionMap).forEach(([n,r])=>{t.has(n)||(e[n]=r)}),e}copy(e){return this._expressions.concat().forEach(n=>{this.unregisterExpression(n)}),e._expressions.forEach(n=>{this.registerExpression(n)}),this.blinkExpressionNames=e.blinkExpressionNames.concat(),this.lookAtExpressionNames=e.lookAtExpressionNames.concat(),this.mouthExpressionNames=e.mouthExpressionNames.concat(),this}clone(){return new im().copy(this)}getExpression(e){var t;return(t=this._expressionMap[e])!=null?t:null}registerExpression(e){this._expressions.push(e),this._expressionMap[e.expressionName]=e}unregisterExpression(e){let t=this._expressions.indexOf(e);t===-1&&console.warn("VRMExpressionManager: The specified expressions is not registered"),this._expressions.splice(t,1),delete this._expressionMap[e.expressionName]}getValue(e){var t;let n=this.getExpression(e);return(t=n?.weight)!=null?t:null}setValue(e,t){let n=this.getExpression(e);n&&(n.weight=XE(t))}resetValues(){this._expressions.forEach(e=>{e.weight=0})}getExpressionTrackName(e){let t=this.getExpression(e);return t?`${t.name}.weight`:null}update(){let e=this._calculateWeightMultipliers();this._expressions.forEach(t=>{t.clearAppliedWeight()}),this._expressions.forEach(t=>{let n=1,r=t.expressionName;this.blinkExpressionNames.indexOf(r)!==-1&&(n*=e.blink),this.lookAtExpressionNames.indexOf(r)!==-1&&(n*=e.lookAt),this.mouthExpressionNames.indexOf(r)!==-1&&(n*=e.mouth),t.applyWeight({multiplier:n})})}_calculateWeightMultipliers(){let e=1,t=1,n=1;return this._expressions.forEach(r=>{e-=r.overrideBlinkAmount,t-=r.overrideLookAtAmount,n-=r.overrideMouthAmount}),e=Math.max(0,e),t=Math.max(0,t),n=Math.max(0,n),{blink:e,lookAt:t,mouth:n}}},yo={Color:"color",EmissionColor:"emissionColor",ShadeColor:"shadeColor",MatcapColor:"matcapColor",RimColor:"rimColor",OutlineColor:"outlineColor"},qE={_Color:yo.Color,_EmissionColor:yo.EmissionColor,_ShadeColor:yo.ShadeColor,_RimColor:yo.RimColor,_OutlineColor:yo.OutlineColor},YE=new he,rm=class sm{constructor({material:e,type:t,targetValue:n,targetAlpha:r}){this.material=e,this.type=t,this.targetValue=n,this.targetAlpha=r??1;let s=this._initColorBindState(),o=this._initAlphaBindState();this._state={color:s,alpha:o}}applyWeight(e){let{color:t,alpha:n}=this._state;if(t!=null){let{propertyName:r,deltaValue:s}=t,o=this.material[r];o?.add(YE.copy(s).multiplyScalar(e))}if(n!=null){let{propertyName:r,deltaValue:s}=n;this.material[r]!=null&&(this.material[r]+=s*e)}}clearAppliedWeight(){let{color:e,alpha:t}=this._state;if(e!=null){let{propertyName:n,initialValue:r}=e,s=this.material[n];s?.copy(r)}if(t!=null){let{propertyName:n,initialValue:r}=t;this.material[n]!=null&&(this.material[n]=r)}}_initColorBindState(){var e,t,n;let{material:r,type:s,targetValue:o}=this,a=this._getPropertyNameMap(),l=(t=(e=a?.[s])==null?void 0:e[0])!=null?t:null;if(l==null)return console.warn(`Tried to add a material color bind to the material ${(n=r.name)!=null?n:"(no name)"}, the type ${s} but the material or the type is not supported.`),null;let u=r[l].clone(),h=new he(o.r-u.r,o.g-u.g,o.b-u.b);return{propertyName:l,initialValue:u,deltaValue:h}}_initAlphaBindState(){var e,t,n;let{material:r,type:s,targetAlpha:o}=this,a=this._getPropertyNameMap(),l=(t=(e=a?.[s])==null?void 0:e[1])!=null?t:null;if(l==null&&o!==1)return console.warn(`Tried to add a material alpha bind to the material ${(n=r.name)!=null?n:"(no name)"}, the type ${s} but the material or the type does not support alpha.`),null;if(l==null)return null;let c=r[l],u=o-c;return{propertyName:l,initialValue:c,deltaValue:u}}_getPropertyNameMap(){var e,t;return(t=(e=Object.entries(sm._propertyNameMapMap).find(([n])=>this.material[n]===!0))==null?void 0:e[1])!=null?t:null}};rm._propertyNameMapMap={isMeshStandardMaterial:{color:["color","opacity"],emissionColor:["emissive",null]},isMeshBasicMaterial:{color:["color","opacity"]},isMToonMaterial:{color:["color","opacity"],emissionColor:["emissive",null],outlineColor:["outlineColorFactor",null],matcapColor:["matcapFactor",null],rimColor:["parametricRimColorFactor",null],shadeColor:["shadeColorFactor",null]}};var Wp=rm,Xp=class{constructor({primitives:i,index:e,weight:t}){this.primitives=i,this.index=e,this.weight=t}applyWeight(i){this.primitives.forEach(e=>{var t;((t=e.morphTargetInfluences)==null?void 0:t[this.index])!=null&&(e.morphTargetInfluences[this.index]+=this.weight*i)})}clearAppliedWeight(){this.primitives.forEach(i=>{var e;((e=i.morphTargetInfluences)==null?void 0:e[this.index])!=null&&(i.morphTargetInfluences[this.index]=0)})}},qp=new Le,om=class am{constructor({material:e,scale:t,offset:n}){var r,s;this.material=e,this.scale=t,this.offset=n;let o=(r=Object.entries(am._propertyNamesMap).find(([a])=>e[a]===!0))==null?void 0:r[1];o==null?(console.warn(`Tried to add a texture transform bind to the material ${(s=e.name)!=null?s:"(no name)"} but the material is not supported.`),this._properties=[]):(this._properties=[],o.forEach(a=>{var l;let c=(l=e[a])==null?void 0:l.clone();if(!c)return null;e[a]=c;let u=c.offset.clone(),h=c.repeat.clone(),d=n.clone().sub(u),f=t.clone().sub(h);this._properties.push({name:a,initialOffset:u,deltaOffset:d,initialScale:h,deltaScale:f})}))}applyWeight(e){this._properties.forEach(t=>{let n=this.material[t.name];n!==void 0&&(n.offset.add(qp.copy(t.deltaOffset).multiplyScalar(e)),n.repeat.add(qp.copy(t.deltaScale).multiplyScalar(e)))})}clearAppliedWeight(){this._properties.forEach(e=>{let t=this.material[e.name];t!==void 0&&(t.offset.copy(e.initialOffset),t.repeat.copy(e.initialScale))})}};om._propertyNamesMap={isMeshStandardMaterial:["map","emissiveMap","bumpMap","normalMap","displacementMap","roughnessMap","metalnessMap","alphaMap"],isMeshBasicMaterial:["map","specularMap","alphaMap"],isMToonMaterial:["map","normalMap","emissiveMap","shadeMultiplyTexture","rimMultiplyTexture","outlineWidthMultiplyTexture","uvAnimationMaskTexture"]};var Yp=om,jE=new Set(["1.0","1.0-beta"]),ZE=class lm{get name(){return"VRMExpressionLoaderPlugin"}constructor(e){this.parser=e}afterRoot(e){return bn(this,null,function*(){e.userData.vrmExpressionManager=yield this._import(e)})}_import(e){return bn(this,null,function*(){let t=yield this._v1Import(e);if(t)return t;let n=yield this._v0Import(e);return n||null})}_v1Import(e){return bn(this,null,function*(){var t,n;let r=this.parser.json;if(!(((t=r.extensionsUsed)==null?void 0:t.indexOf("VRMC_vrm"))!==-1))return null;let o=(n=r.extensions)==null?void 0:n.VRMC_vrm;if(!o)return null;let a=o.specVersion;if(!jE.has(a))return console.warn(`VRMExpressionLoaderPlugin: Unknown VRMC_vrm specVersion "${a}"`),null;let l=o.expressions;if(!l)return null;let c=new Set(Object.values(Dl)),u=new Map;l.preset!=null&&Object.entries(l.preset).forEach(([d,f])=>{if(f!=null){if(!c.has(d)){console.warn(`VRMExpressionLoaderPlugin: Unknown preset name "${d}" detected. Ignoring the expression`);return}u.set(d,f)}}),l.custom!=null&&Object.entries(l.custom).forEach(([d,f])=>{if(c.has(d)){console.warn(`VRMExpressionLoaderPlugin: Custom expression cannot have preset name "${d}". Ignoring the expression`);return}u.set(d,f)});let h=new Gp;return yield Promise.all(Array.from(u.entries()).map(d=>bn(this,[d],function*([f,g]){var _,m,p,T,b,y,A;let w=new Vp(f);if(e.scene.add(w),w.isBinary=(_=g.isBinary)!=null?_:!1,w.overrideBlink=(m=g.overrideBlink)!=null?m:"none",w.overrideLookAt=(p=g.overrideLookAt)!=null?p:"none",w.overrideMouth=(T=g.overrideMouth)!=null?T:"none",(b=g.morphTargetBinds)==null||b.forEach(C=>bn(this,null,function*(){var L;if(C.node===void 0||C.index===void 0)return;let E=yield zp(e,C.node),M=C.index;if(!E.every(P=>Array.isArray(P.morphTargetInfluences)&&M<P.morphTargetInfluences.length)){console.warn(`VRMExpressionLoaderPlugin: ${g.name} attempts to index morph #${M} but not found.`);return}w.addBind(new Xp({primitives:E,index:M,weight:(L=C.weight)!=null?L:1}))})),g.materialColorBinds||g.textureTransformBinds){let C=[];e.scene.traverse(L=>{let E=L.material;E&&(Array.isArray(E)?C.push(...E):C.push(E))}),(y=g.materialColorBinds)==null||y.forEach(L=>bn(this,null,function*(){C.filter(M=>{var P;let F=(P=this.parser.associations.get(M))==null?void 0:P.materials;return L.material===F}).forEach(M=>{w.addBind(new Wp({material:M,type:L.type,targetValue:new he().fromArray(L.targetValue),targetAlpha:L.targetValue[3]}))})})),(A=g.textureTransformBinds)==null||A.forEach(L=>bn(this,null,function*(){C.filter(M=>{var P;let F=(P=this.parser.associations.get(M))==null?void 0:P.materials;return L.material===F}).forEach(M=>{var P,F;w.addBind(new Yp({material:M,offset:new Le().fromArray((P=L.offset)!=null?P:[0,0]),scale:new Le().fromArray((F=L.scale)!=null?F:[1,1])}))})}))}h.registerExpression(w)}))),h})}_v0Import(e){return bn(this,null,function*(){var t;let n=this.parser.json,r=(t=n.extensions)==null?void 0:t.VRM;if(!r)return null;let s=r.blendShapeMaster;if(!s)return null;let o=new Gp,a=s.blendShapeGroups;if(!a)return o;let l=new Set;return yield Promise.all(a.map(c=>bn(this,null,function*(){var u;let h=c.presetName,d=h!=null&&lm.v0v1PresetNameMap[h]||null,f=d??c.name;if(f==null){console.warn("VRMExpressionLoaderPlugin: One of custom expressions has no name. Ignoring the expression");return}if(l.has(f)){console.warn(`VRMExpressionLoaderPlugin: An expression preset ${h} has duplicated entries. Ignoring the expression`);return}l.add(f);let g=new Vp(f);e.scene.add(g),g.isBinary=(u=c.isBinary)!=null?u:!1,c.binds&&c.binds.forEach(m=>bn(this,null,function*(){var p;if(m.mesh===void 0||m.index===void 0)return;let T=[];if((p=n.nodes)==null||p.forEach((y,A)=>{y.mesh===m.mesh&&T.push(A)}),T.length===0){console.warn(`VRMExpressionLoaderPlugin: ${c.name} attempts to bind a morph target to the mesh #${m.mesh} but the mesh is not found or not used in the scene. Ignoring the bind.`);return}let b=m.index;yield Promise.all(T.map(y=>bn(this,null,function*(){var A;let w=yield zp(e,y);if(!w.every(C=>Array.isArray(C.morphTargetInfluences)&&b<C.morphTargetInfluences.length)){console.warn(`VRMExpressionLoaderPlugin: ${c.name} attempts to index ${b}th morph but not found.`);return}g.addBind(new Xp({primitives:w,index:b,weight:.01*((A=m.weight)!=null?A:100)}))})))}));let _=c.materialValues;_&&_.length!==0&&_.forEach(m=>{if(m.materialName===void 0||m.propertyName===void 0||m.targetValue===void 0)return;let p=[];e.scene.traverse(b=>{if(b.material){let y=b.material;Array.isArray(y)?p.push(...y.filter(A=>(A.name===m.materialName||A.name===m.materialName+" (Outline)")&&p.indexOf(A)===-1)):y.name===m.materialName&&p.indexOf(y)===-1&&p.push(y)}});let T=m.propertyName;p.forEach(b=>{if(T==="_MainTex_ST"){let A=new Le(m.targetValue[0],m.targetValue[1]),w=new Le(m.targetValue[2],m.targetValue[3]);w.y=1-w.y-A.y,g.addBind(new Yp({material:b,scale:A,offset:w}));return}let y=qE[T];if(y){g.addBind(new Wp({material:b,type:y,targetValue:new he().fromArray(m.targetValue),targetAlpha:m.targetValue[3]}));return}console.warn(T+" is not supported")})}),o.registerExpression(g)}))),o})}};ZE.v0v1PresetNameMap={a:"aa",e:"ee",i:"ih",o:"oh",u:"ou",blink:"blink",joy:"happy",angry:"angry",sorrow:"sad",fun:"relaxed",lookup:"lookUp",lookdown:"lookDown",lookleft:"lookLeft",lookright:"lookRight",blink_l:"blinkLeft",blink_r:"blinkRight",neutral:"neutral"};var cm=class cs{constructor(e,t){this._firstPersonOnlyLayer=cs.DEFAULT_FIRSTPERSON_ONLY_LAYER,this._thirdPersonOnlyLayer=cs.DEFAULT_THIRDPERSON_ONLY_LAYER,this._initializedLayers=!1,this.humanoid=e,this.meshAnnotations=t}copy(e){if(this.humanoid!==e.humanoid)throw new Error("VRMFirstPerson: humanoid must be same in order to copy");return this.meshAnnotations=e.meshAnnotations.map(t=>({meshes:t.meshes.concat(),type:t.type})),this}clone(){return new cs(this.humanoid,this.meshAnnotations).copy(this)}get firstPersonOnlyLayer(){return this._firstPersonOnlyLayer}get thirdPersonOnlyLayer(){return this._thirdPersonOnlyLayer}setup({firstPersonOnlyLayer:e=cs.DEFAULT_FIRSTPERSON_ONLY_LAYER,thirdPersonOnlyLayer:t=cs.DEFAULT_THIRDPERSON_ONLY_LAYER}={}){this._initializedLayers||(this._firstPersonOnlyLayer=e,this._thirdPersonOnlyLayer=t,this.meshAnnotations.forEach(n=>{n.meshes.forEach(r=>{n.type==="firstPersonOnly"?(r.layers.set(this._firstPersonOnlyLayer),r.traverse(s=>s.layers.set(this._firstPersonOnlyLayer))):n.type==="thirdPersonOnly"?(r.layers.set(this._thirdPersonOnlyLayer),r.traverse(s=>s.layers.set(this._thirdPersonOnlyLayer))):n.type==="auto"&&this._createHeadlessModel(r)})}),this._initializedLayers=!0)}_excludeTriangles(e,t,n,r){let s=0;if(t!=null&&t.length>0)for(let o=0;o<e.length;o+=3){let a=e[o],l=e[o+1],c=e[o+2],u=t[a],h=n[a];if(u[0]>0&&r.includes(h[0])||u[1]>0&&r.includes(h[1])||u[2]>0&&r.includes(h[2])||u[3]>0&&r.includes(h[3]))continue;let d=t[l],f=n[l];if(d[0]>0&&r.includes(f[0])||d[1]>0&&r.includes(f[1])||d[2]>0&&r.includes(f[2])||d[3]>0&&r.includes(f[3]))continue;let g=t[c],_=n[c];g[0]>0&&r.includes(_[0])||g[1]>0&&r.includes(_[1])||g[2]>0&&r.includes(_[2])||g[3]>0&&r.includes(_[3])||(e[s++]=a,e[s++]=l,e[s++]=c)}return s}_createErasedMesh(e,t){let n=new oi(e.geometry.clone(),e.material);n.name=`${e.name}(erase)`,n.frustumCulled=e.frustumCulled,n.layers.set(this._firstPersonOnlyLayer);let r=n.geometry,s=r.getAttribute("skinIndex"),o=s instanceof fi?[]:s.array,a=[];for(let _=0;_<o.length;_+=4)a.push([o[_],o[_+1],o[_+2],o[_+3]]);let l=r.getAttribute("skinWeight"),c=l instanceof fi?[]:l.array,u=[];for(let _=0;_<c.length;_+=4)u.push([c[_],c[_+1],c[_+2],c[_+3]]);let h=r.getIndex();if(!h)throw new Error("The geometry doesn't have an index buffer");let d=Array.from(h.array),f=this._excludeTriangles(d,u,a,t),g=[];for(let _=0;_<f;_++)g[_]=d[_];return r.setIndex(g),e.onBeforeRender&&(n.onBeforeRender=e.onBeforeRender),n.bind(new an(e.skeleton.bones,e.skeleton.boneInverses),new Me),n}_createHeadlessModelForSkinnedMesh(e,t){let n=[];if(t.skeleton.bones.forEach((s,o)=>{this._isEraseTarget(s)&&n.push(o)}),!n.length){t.layers.enable(this._thirdPersonOnlyLayer),t.layers.enable(this._firstPersonOnlyLayer);return}t.layers.set(this._thirdPersonOnlyLayer);let r=this._createErasedMesh(t,n);e.add(r)}_createHeadlessModel(e){if(e.type==="Group")if(e.layers.set(this._thirdPersonOnlyLayer),this._isEraseTarget(e))e.traverse(t=>t.layers.set(this._thirdPersonOnlyLayer));else{let t=new _t;t.name=`_headless_${e.name}`,t.layers.set(this._firstPersonOnlyLayer),e.parent.add(t),e.children.filter(n=>n.type==="SkinnedMesh").forEach(n=>{let r=n;this._createHeadlessModelForSkinnedMesh(t,r)})}else if(e.type==="SkinnedMesh"){let t=e;this._createHeadlessModelForSkinnedMesh(e.parent,t)}else this._isEraseTarget(e)&&(e.layers.set(this._thirdPersonOnlyLayer),e.traverse(t=>t.layers.set(this._thirdPersonOnlyLayer)))}_isEraseTarget(e){return e===this.humanoid.getRawBoneNode("head")?!0:e.parent?this._isEraseTarget(e.parent):!1}};cm.DEFAULT_FIRSTPERSON_ONLY_LAYER=9;cm.DEFAULT_THIRDPERSON_ONLY_LAYER=10;var QA=new S,eR=new S,tR=new ie,jp={hips:null,spine:"hips",chest:"spine",upperChest:"chest",neck:"upperChest",head:"neck",leftEye:"head",rightEye:"head",jaw:"head",leftUpperLeg:"hips",leftLowerLeg:"leftUpperLeg",leftFoot:"leftLowerLeg",leftToes:"leftFoot",rightUpperLeg:"hips",rightLowerLeg:"rightUpperLeg",rightFoot:"rightLowerLeg",rightToes:"rightFoot",leftShoulder:"upperChest",leftUpperArm:"leftShoulder",leftLowerArm:"leftUpperArm",leftHand:"leftLowerArm",rightShoulder:"upperChest",rightUpperArm:"rightShoulder",rightLowerArm:"rightUpperArm",rightHand:"rightLowerArm",leftThumbMetacarpal:"leftHand",leftThumbProximal:"leftThumbMetacarpal",leftThumbDistal:"leftThumbProximal",leftIndexProximal:"leftHand",leftIndexIntermediate:"leftIndexProximal",leftIndexDistal:"leftIndexIntermediate",leftMiddleProximal:"leftHand",leftMiddleIntermediate:"leftMiddleProximal",leftMiddleDistal:"leftMiddleIntermediate",leftRingProximal:"leftHand",leftRingIntermediate:"leftRingProximal",leftRingDistal:"leftRingIntermediate",leftLittleProximal:"leftHand",leftLittleIntermediate:"leftLittleProximal",leftLittleDistal:"leftLittleIntermediate",rightThumbMetacarpal:"rightHand",rightThumbProximal:"rightThumbMetacarpal",rightThumbDistal:"rightThumbProximal",rightIndexProximal:"rightHand",rightIndexIntermediate:"rightIndexProximal",rightIndexDistal:"rightIndexIntermediate",rightMiddleProximal:"rightHand",rightMiddleIntermediate:"rightMiddleProximal",rightMiddleDistal:"rightMiddleIntermediate",rightRingProximal:"rightHand",rightRingIntermediate:"rightRingProximal",rightRingDistal:"rightRingIntermediate",rightLittleProximal:"rightHand",rightLittleIntermediate:"rightLittleProximal",rightLittleDistal:"rightLittleIntermediate"};function $E(i){return i.invert?i.invert():i.inverse(),i}var nR=new S,iR=new ie,rR=new S,sR=new ie,oR=new S,aR=new ie,lR=new ie,cR=new S,uR=new S,Zp=Math.sqrt(2)/2,hR=new ie(0,0,-Zp,Zp),dR=new S(0,1,0),JE=new S,KE=new S;function fh(i,e){return i.matrixWorld.decompose(JE,e,KE),e}function Ll(i){return[Math.atan2(-i.z,i.x),Math.atan2(i.y,Math.sqrt(i.x*i.x+i.z*i.z))]}function $p(i){let e=Math.round(i/2/Math.PI);return i-2*Math.PI*e}var Jp=new S(0,0,1),QE=new S,eb=new S,tb=new S,nb=new ie,ch=new ie,Kp=new ie,ib=new ie,uh=new xt,um=class hm{constructor(e,t){this.offsetFromHeadBone=new S,this.autoUpdate=!0,this.faceFront=new S(0,0,1),this.humanoid=e,this.applier=t,this._yaw=0,this._pitch=0,this._needsUpdate=!0,this._restHeadWorldQuaternion=this.getLookAtWorldQuaternion(new ie)}get yaw(){return this._yaw}set yaw(e){this._yaw=e,this._needsUpdate=!0}get pitch(){return this._pitch}set pitch(e){this._pitch=e,this._needsUpdate=!0}get euler(){return console.warn("VRMLookAt: euler is deprecated. use getEuler() instead."),this.getEuler(new xt)}getEuler(e){return e.set(Ne.DEG2RAD*this._pitch,Ne.DEG2RAD*this._yaw,0,"YXZ")}copy(e){if(this.humanoid!==e.humanoid)throw new Error("VRMLookAt: humanoid must be same in order to copy");return this.offsetFromHeadBone.copy(e.offsetFromHeadBone),this.applier=e.applier,this.autoUpdate=e.autoUpdate,this.target=e.target,this.faceFront.copy(e.faceFront),this}clone(){return new hm(this.humanoid,this.applier).copy(this)}reset(){this._yaw=0,this._pitch=0,this._needsUpdate=!0}getLookAtWorldPosition(e){let t=this.humanoid.getRawBoneNode("head");return e.copy(this.offsetFromHeadBone).applyMatrix4(t.matrixWorld)}getLookAtWorldQuaternion(e){let t=this.humanoid.getRawBoneNode("head");return fh(t,e)}getFaceFrontQuaternion(e){if(this.faceFront.distanceToSquared(Jp)<.01)return e.copy(this._restHeadWorldQuaternion).invert();let[t,n]=Ll(this.faceFront);return uh.set(0,.5*Math.PI+t,n,"YZX"),e.setFromEuler(uh).premultiply(ib.copy(this._restHeadWorldQuaternion).invert())}getLookAtWorldDirection(e){return this.getLookAtWorldQuaternion(ch),this.getFaceFrontQuaternion(Kp),e.copy(Jp).applyQuaternion(ch).applyQuaternion(Kp).applyEuler(this.getEuler(uh))}lookAt(e){let t=nb.copy(this._restHeadWorldQuaternion).multiply($E(this.getLookAtWorldQuaternion(ch))),n=this.getLookAtWorldPosition(eb),r=tb.copy(e).sub(n).applyQuaternion(t).normalize(),[s,o]=Ll(this.faceFront),[a,l]=Ll(r),c=$p(a-s),u=$p(o-l);this._yaw=Ne.RAD2DEG*c,this._pitch=Ne.RAD2DEG*u,this._needsUpdate=!0}update(e){this.target!=null&&this.autoUpdate&&this.lookAt(this.target.getWorldPosition(QE)),this._needsUpdate&&(this._needsUpdate=!1,this.applier.applyYawPitch(this._yaw,this._pitch))}};um.EULER_ORDER="YXZ";var rb=um,sb=new S(0,0,1),qn=new ie,ls=new ie,En=new xt(0,0,0,"YXZ"),ob=class{constructor(i,e,t,n,r){this.humanoid=i,this.rangeMapHorizontalInner=e,this.rangeMapHorizontalOuter=t,this.rangeMapVerticalDown=n,this.rangeMapVerticalUp=r,this.faceFront=new S(0,0,1),this._restQuatLeftEye=new ie,this._restQuatRightEye=new ie,this._restLeftEyeParentWorldQuat=new ie,this._restRightEyeParentWorldQuat=new ie;let s=this.humanoid.getRawBoneNode("leftEye"),o=this.humanoid.getRawBoneNode("rightEye");s&&(this._restQuatLeftEye.copy(s.quaternion),fh(s.parent,this._restLeftEyeParentWorldQuat)),o&&(this._restQuatRightEye.copy(o.quaternion),fh(o.parent,this._restRightEyeParentWorldQuat))}applyYawPitch(i,e){let t=this.humanoid.getRawBoneNode("leftEye"),n=this.humanoid.getRawBoneNode("rightEye"),r=this.humanoid.getNormalizedBoneNode("leftEye"),s=this.humanoid.getNormalizedBoneNode("rightEye");t&&(e<0?En.x=-Ne.DEG2RAD*this.rangeMapVerticalDown.map(-e):En.x=Ne.DEG2RAD*this.rangeMapVerticalUp.map(e),i<0?En.y=-Ne.DEG2RAD*this.rangeMapHorizontalInner.map(-i):En.y=Ne.DEG2RAD*this.rangeMapHorizontalOuter.map(i),qn.setFromEuler(En),this._getWorldFaceFrontQuat(ls),r.quaternion.copy(ls).multiply(qn).multiply(ls.invert()),qn.copy(this._restLeftEyeParentWorldQuat),t.quaternion.copy(r.quaternion).multiply(qn).premultiply(qn.invert()).multiply(this._restQuatLeftEye)),n&&(e<0?En.x=-Ne.DEG2RAD*this.rangeMapVerticalDown.map(-e):En.x=Ne.DEG2RAD*this.rangeMapVerticalUp.map(e),i<0?En.y=-Ne.DEG2RAD*this.rangeMapHorizontalOuter.map(-i):En.y=Ne.DEG2RAD*this.rangeMapHorizontalInner.map(i),qn.setFromEuler(En),this._getWorldFaceFrontQuat(ls),s.quaternion.copy(ls).multiply(qn).multiply(ls.invert()),qn.copy(this._restRightEyeParentWorldQuat),n.quaternion.copy(s.quaternion).multiply(qn).premultiply(qn.invert()).multiply(this._restQuatRightEye))}lookAt(i){console.warn("VRMLookAtBoneApplier: lookAt() is deprecated. use apply() instead.");let e=Ne.RAD2DEG*i.y,t=Ne.RAD2DEG*i.x;this.applyYawPitch(e,t)}_getWorldFaceFrontQuat(i){if(this.faceFront.distanceToSquared(sb)<.01)return i.identity();let[e,t]=Ll(this.faceFront);return En.set(0,.5*Math.PI+e,t,"YZX"),i.setFromEuler(En)}};ob.type="bone";var ab=class{constructor(i,e,t,n,r){this.expressions=i,this.rangeMapHorizontalInner=e,this.rangeMapHorizontalOuter=t,this.rangeMapVerticalDown=n,this.rangeMapVerticalUp=r}applyYawPitch(i,e){e<0?(this.expressions.setValue("lookDown",0),this.expressions.setValue("lookUp",this.rangeMapVerticalUp.map(-e))):(this.expressions.setValue("lookUp",0),this.expressions.setValue("lookDown",this.rangeMapVerticalDown.map(e))),i<0?(this.expressions.setValue("lookLeft",0),this.expressions.setValue("lookRight",this.rangeMapHorizontalOuter.map(-i))):(this.expressions.setValue("lookRight",0),this.expressions.setValue("lookLeft",this.rangeMapHorizontalOuter.map(i)))}lookAt(i){console.warn("VRMLookAtBoneApplier: lookAt() is deprecated. use apply() instead.");let e=Ne.RAD2DEG*i.y,t=Ne.RAD2DEG*i.x;this.applyYawPitch(e,t)}};ab.type="expression";var Qp=180/Math.PI,hh=new xt,em=class extends $e{constructor(i){super(),this.vrmLookAt=i,this.type="VRMLookAtQuaternionProxy";let e=this.rotation._onChangeCallback;this.rotation._onChange(()=>{e(),this._applyToLookAt()});let t=this.quaternion._onChangeCallback;this.quaternion._onChange(()=>{t(),this._applyToLookAt()})}_applyToLookAt(){hh.setFromQuaternion(this.quaternion,rb.EULER_ORDER),this.vrmLookAt.yaw=Qp*hh.y,this.vrmLookAt.pitch=Qp*hh.x}};function lb(i,e,t){var n,r;let s=new Map,o=new Map;for(let[a,l]of i.humanoidTracks.rotation.entries()){let c=(n=e.getNormalizedBoneNode(a))==null?void 0:n.name;if(c!=null){let u=new vn(`${c}.quaternion`,l.times,l.values.map((h,d)=>t==="0"&&d%2===0?-h:h));o.set(a,u)}}for(let[a,l]of i.humanoidTracks.translation.entries()){let c=(r=e.getNormalizedBoneNode(a))==null?void 0:r.name;if(c!=null){let u=i.restHipsPosition.y,d=e.normalizedRestPose.hips.position[1]/u,f=l.clone();f.values=f.values.map((g,_)=>(t==="0"&&_%3!==1?-g:g)*d),f.name=`${c}.position`,s.set(a,f)}}return{translation:s,rotation:o}}function cb(i,e){let t=new Map,n=new Map;for(let[r,s]of i.expressionTracks.preset.entries()){let o=e.getExpressionTrackName(r);if(o!=null){let a=s.clone();a.name=o,t.set(r,a)}}for(let[r,s]of i.expressionTracks.custom.entries()){let o=e.getExpressionTrackName(r);if(o!=null){let a=s.clone();a.name=o,n.set(r,a)}}return{preset:t,custom:n}}function ub(i,e){if(i.lookAtTrack==null)return null;let t=i.lookAtTrack.clone();return t.name=e,t}function dm(i,e){let t=[],n=lb(i,e.humanoid,e.meta.metaVersion);if(t.push(...n.translation.values()),t.push(...n.rotation.values()),e.expressionManager!=null){let r=cb(i,e.expressionManager);t.push(...r.preset.values()),t.push(...r.custom.values())}if(e.lookAt!=null){let r=e.scene.children.find(o=>o instanceof em);r==null?(console.warn("createVRMAnimationClip: VRMLookAtQuaternionProxy is not found. Creating a new one automatically. To suppress this warning, create a VRMLookAtQuaternionProxy manually"),r=new em(e.lookAt),r.name="VRMLookAtQuaternionProxy",e.scene.add(r)):r.name===""&&(console.warn("createVRMAnimationClip: VRMLookAtQuaternionProxy is found but its name is not set. Setting the name automatically. To suppress this warning, set the name manually"),r.name="VRMLookAtQuaternionProxy");let s=ub(i,`${r.name}.quaternion`);s!=null&&t.push(s)}return new hi("Clip",i.duration,t)}var hb=class{constructor(){this.duration=0,this.restHipsPosition=new S,this.humanoidTracks={translation:new Map,rotation:new Map},this.expressionTracks={preset:new Map,custom:new Map},this.lookAtTrack=null}};function tm(i,e){let t=i.length,n=[],r=[],s=0;for(let o=0;o<t;o++){let a=i[o];s<=0&&(s=e,r=[],n.push(r)),r.push(a),s--}return n}var db=new Me,xo=new S,dh=new ie,nm=new ie,fb=new ie,pb=new Set(["1.0","1.0-draft"]),mb=new Set(Object.values(Dl)),fm=class{constructor(i){this.parser=i}get name(){return"VRMC_vrm_animation"}afterRoot(i){return Hp(this,null,function*(){var e,t,n;let r=i.parser.json,s=r.extensionsUsed;if(s==null||s.indexOf(this.name)==-1)return;let o=(e=r.extensions)==null?void 0:e[this.name];if(o==null)return;let a=o.specVersion;if(a==null)console.warn("VRMAnimationLoaderPlugin: specVersion of the VRMA is not defined. Consider updating the animation file. Assuming the spec version is 1.0.");else{if(!pb.has(a)){console.warn(`VRMAnimationLoaderPlugin: Unknown VRMC_vrm_animation spec version: ${a}`);return}a==="1.0-draft"&&console.warn("VRMAnimationLoaderPlugin: Using a draft spec version: 1.0-draft. Some behaviors may be different. Consider updating the animation file.")}let l=this._createNodeMap(o),c=yield this._createBoneWorldMatrixMap(i,o),u=(n=(t=o.humanoid)==null?void 0:t.humanBones.hips)==null?void 0:n.node,h=u!=null?yield i.parser.getDependency("node",u):null,d=new S;h?.getWorldPosition(d),d.y<.001&&console.warn("VRMAnimationLoaderPlugin: The loaded VRM Animation might violate the VRM T-pose (The y component of the rest hips position is approximately zero or below.)");let g=i.animations.map((_,m)=>{let p=r.animations[m],T=this._parseAnimation(_,p,l,c);return T.restHipsPosition=d,T});i.userData.vrmAnimations=g})}_createNodeMap(i){var e,t,n,r,s;let o=new Map,a=new Map,l=(e=i.humanoid)==null?void 0:e.humanBones;l&&Object.entries(l).forEach(([d,f])=>{let g=f?.node;g!=null&&o.set(g,d)});let c=(t=i.expressions)==null?void 0:t.preset;c&&Object.entries(c).forEach(([d,f])=>{let g=f?.node;g!=null&&a.set(g,d)});let u=(n=i.expressions)==null?void 0:n.custom;u&&Object.entries(u).forEach(([d,f])=>{let{node:g}=f;a.set(g,d)});let h=(s=(r=i.lookAt)==null?void 0:r.node)!=null?s:null;return{humanoidIndexToName:o,expressionsIndexToName:a,lookAtIndex:h}}_createBoneWorldMatrixMap(i,e){return Hp(this,null,function*(){var t,n;i.scene.updateWorldMatrix(!1,!0);let r=yield i.parser.getDependencies("node"),s=new Map;if(e.humanoid==null)return s;for(let[o,a]of Object.entries(e.humanoid.humanBones)){let l=a?.node;if(l!=null){let c=r[l];s.set(o,c.matrixWorld),o==="hips"&&s.set("hipsParent",(n=(t=c.parent)==null?void 0:t.matrixWorld)!=null?n:db)}}return s})}_parseAnimation(i,e,t,n){let r=i.tracks,s=e.channels,o=new hb;return o.duration=i.duration,s.forEach((a,l)=>{let{node:c,path:u}=a.target,h=r[l];if(c==null)return;let d=t.humanoidIndexToName.get(c);if(d!=null){let g=jp[d];for(;g!=null&&n.get(g)==null;)g=jp[g];if(g==null&&(g="hipsParent"),u==="translation")if(d!=="hips")console.warn(`The loading animation contains a translation track for ${d}, which is not permitted in the VRMC_vrm_animation spec. ignoring the track`);else{let _=n.get("hipsParent"),m=tm(h.values,3).flatMap(T=>xo.fromArray(T).applyMatrix4(_).toArray()),p=h.clone();p.values=new Float32Array(m),o.humanoidTracks.translation.set(d,p)}else if(u==="rotation"){let _=n.get(d),m=n.get(g);_.decompose(xo,dh,xo),dh.invert(),m.decompose(xo,nm,xo);let p=tm(h.values,4).flatMap(b=>fb.fromArray(b).premultiply(nm).multiply(dh).toArray()),T=h.clone();T.values=new Float32Array(p),o.humanoidTracks.rotation.set(d,T)}else throw new Error(`Invalid path "${u}"`);return}let f=t.expressionsIndexToName.get(c);if(f!=null){if(u==="translation"){let g=h.times,_=new Float32Array(h.values.length/3);for(let p=0;p<_.length;p++)_[p]=h.values[3*p];let m=new _n(`${f}.weight`,g,_);mb.has(f)?o.expressionTracks.preset.set(f,m):o.expressionTracks.custom.set(f,m)}else throw new Error(`Invalid path "${u}"`);return}if(c===t.lookAtIndex)if(u==="rotation")o.lookAtTrack=h;else throw new Error(`Invalid path "${u}"`)}),o}};var gb=/^miller-avatar-local:\/\/app\/session\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.vrma$/u,_b=1e4,ct=class extends Error{constructor(t,n,r){super(n,r);this.code=t;this.name="MotionLoadError"}code};function Nl(i){if(!gb.test(i))throw new Error("renderer rejected non-session motion URL")}async function pm(i,e,t,n=Ab){if(Nl(i.url),t.aborted||!us(i))throw hr();let r=n.timeoutMilliseconds??_b;if(!Number.isSafeInteger(r)||r<=0)throw new RangeError("motion load timeout must be a positive safe integer");let s=n.timeoutScheduler??wb,o=n.createLoader();if(t.aborted||!us(i))throw hr();let a=null,l=!1,c=!1,u=()=>{},h=()=>{},d,f=new Promise((_,m)=>{u=_,h=m}),g=()=>{c||h(hr())};t.addEventListener("abort",g,{once:!0});try{if(o.register(w=>n.createPlugin(w)),t.aborted||!us(i))throw hr();a=s.request(()=>{l=!0,h(new ct("motion_load_timeout","motion load timed out"))},r),o.load(i.url,w=>u(w),void 0,w=>h(w));let _=await f;if(t.aborted||!us(i))throw hr();Mb(_.parser.json);let m=_.userData.vrmAnimations;if(!Array.isArray(m)||m.length!==1)throw new ct("motion_load_failed","expected exactly one VRMA animation");let p=vb(e),T=n.createClip(m[0],e);d=T;let b=T.tracks.filter(w=>bb(w,p));if(b.length===0)throw ph(T,n),d=void 0,new ct("motion_load_failed","VRMA animation has no usable humanoid tracks");Sb(b),T.tracks=b;let y=xb(e),A=y===null?void 0:yb(T,y.name,y.restPlanar);if(t.aborted||!us(i))throw ph(T,n),d=void 0,hr();return{motionToken:i.motionToken,clip:T,steadyClip:A}}catch(_){throw d!==void 0&&(ph(d,n),d=void 0),l?new ct("motion_load_timeout","motion load timed out",{cause:_}):t.aborted||!us(i)?hr():_ instanceof ct?_:new ct("motion_load_failed",Tb(_),{cause:_})}finally{c=!0,t.removeEventListener("abort",g),a!==null&&s.cancel(a)}}function vb(i){let e=i.humanoid?.normalizedHumanBones;if(!e)throw new ct("motion_load_failed","avatar has no normalized humanoid bones");let t=new Set;for(let n of Object.values(e)){let s=n?.node?.name;if(typeof s!="string"||s.trim()==="")throw new ct("motion_load_failed","normalized humanoid bone name is empty");if(t.has(s))throw new ct("motion_load_failed","normalized humanoid bone names are not unique");t.add(s)}if(t.size===0)throw new ct("motion_load_failed","avatar has no normalized humanoid bones");return t}function yb(i,e,t){let n=i.clone();n.name=`${i.name}:steady`;let r=n.tracks.find(a=>a.name===`${e}.position`);if(!r||r.times.length===0)return n;let s=r.values.length/r.times.length,o=r.createInterpolant?.isInterpolantFactoryMethodGLTFCubicSpline===!0;if(!o&&s===3){let a=t?.x??r.values[0],l=t?.z??r.values[2];for(let c=0;c<r.values.length;c+=3)r.values[c]=a,r.values[c+2]=l}else if(o&&s===9){let l=t?.x??r.values[3],c=t?.z??r.values[5];for(let u=0;u<r.values.length;u+=9)r.values[u]=0,r.values[u+2]=0,r.values[u+3]=l,r.values[u+5]=c,r.values[u+6]=0,r.values[u+8]=0}return n}function xb(i){let e=i.humanoid,n=e?.normalizedHumanBones?.hips?.node;if(typeof n?.name!="string"||n.name.trim()==="")return null;let r=e?.normalizedRestPose?.hips?.position,s=Array.isArray(r)?r:r?[r.x,r.y,r.z]:[],o=s[0],a=s[2],l=typeof o=="number"&&Number.isFinite(o)&&typeof a=="number"&&Number.isFinite(a)?{x:o,z:a}:void 0;return{name:n.name,restPlanar:l}}function Mb(i){let e=Mo(i.extensions)?.VRMC_vrm_animation;if(Mo(e)?.specVersion!=="1.0")throw new ct("motion_load_failed","VRMA document is not version 1.0");let t=typeof i.scene=="number"&&Number.isSafeInteger(i.scene)?i.scene:null;if(t===null)throw new ct("motion_load_failed","VRMA document has no default scene");let n=i.scenes;if(!Array.isArray(n)||t<0||t>=n.length||!Mo(n[t]))throw new ct("motion_load_failed","VRMA document has an invalid default scene");if(!Array.isArray(i.animations)||i.animations.length!==1)throw new ct("motion_load_failed","VRMA document must declare exactly one source animation");if(mh(i))throw new ct("motion_load_failed","VRMA document contains an external URI");Eb(i,Mo(n[t]))}function Eb(i,e){let t=i.nodes,n=e.nodes;if(!Array.isArray(t)||!Array.isArray(n))throw new ct("motion_load_failed","VRMA default scene is missing node references");let r=new Set,s=new Set,o=a=>{if(typeof a!="number"||!Number.isSafeInteger(a)||a<0||a>=t.length)throw new ct("motion_load_failed","VRMA default scene references an invalid node");let l=a;if(s.has(l))throw new ct("motion_load_failed","VRMA node hierarchy is cyclic");if(r.has(l))return;let c=Mo(t[l]);if(!c)throw new ct("motion_load_failed","VRMA node is not an object");if(s.add(l),r.add(l),Array.isArray(c.children))for(let u of c.children)o(u);s.delete(l)};for(let a of n)o(a)}function mh(i){if(Array.isArray(i))return i.some(mh);if(!i||typeof i!="object")return!1;for(let[e,t]of Object.entries(i))if(e==="uri"||mh(t))return!0;return!1}function bb(i,e){let t=i.name.lastIndexOf(".");if(t<=0)return!1;let n=i.name.slice(0,t),r=i.name.slice(t+1);return e.has(n)&&(r==="position"||r==="quaternion")}function Sb(i){for(let e of i)if(![...e.times,...e.values].every(Number.isFinite))throw new ct("motion_load_failed","converted humanoid track samples must be finite")}function us(i){return i.isCurrent?.()??!0}function ph(i,e){e.disposeClip?.(i)}function hr(){let i=new ct("cancelled","motion load cancelled");return i.name="AbortError",i}function Tb(i){return i instanceof Error?i.message:"motion load failed"}function Mo(i){return i!==null&&typeof i=="object"&&!Array.isArray(i)?i:void 0}var wb={request(i,e){return globalThis.setTimeout(i,e)},cancel(i){globalThis.clearTimeout(i)}},Ab={createLoader(){return new ts},createPlugin(i){return new fm(i)},createClip(i,e){return dm(i,e)}};var ds=["aa","ih","ou","ee","oh"];function Rb(i,e){let t={aa:0,ih:0,ou:0,ee:0,oh:0},n=i.vowels??{aa:i.scalar,ih:0,ou:0,ee:0,oh:0};for(let r of ds){let s=Cb(n[r]);e[r]?t[r]+=s:r!=="aa"&&e.aa&&(t.aa+=s)}return t.aa=Math.min(1,t.aa),gh(t)}var Ul=class{current=hs();capabilities;constructor(e){this.capabilities=Object.freeze({...e})}update(e){let t=Rb(e,this.capabilities),n={aa:0,ih:0,ou:0,ee:0,oh:0};for(let r of ds){let s=this.current[r],o=t[r],a=o>s?.55:.3,l=s+(o-s)*a;n[r]=l<.001?0:Math.min(1,l)}return this.current=gh(n),this.current}clear(){return this.current=hs(),this.current}};function hs(){return gh({aa:0,ih:0,ou:0,ee:0,oh:0})}function Cb(i){return Number.isFinite(i)?Math.min(1,Math.max(0,i)):0}function gh(i){return Object.freeze(i)}var Ol=class{mixer;root;resetNormalizedPose;onActive;onFault;finishedListener=e=>this.finished(e);actions=new Map;roleRecords=new Map;failedTokens=new Set;identity=null;active={role:null,mode:"rest",token:null};latestProjection=null;desiredSteadyRole="idle";lastActiveSignature=null;transition=null;suspended=!1;reducedMotion;disposed=!1;completionGeneration=0;constructor(e){this.mixer=e.mixer,this.root=e.root,this.resetNormalizedPose=e.resetNormalizedPose,this.reducedMotion=e.initialReducedMotion??!1,this.onActive=e.onActive,this.onFault=e.onFault,this.mixer.addEventListener("finished",this.finishedListener)}replaceRegistry(e){if(!this.disposed){this.clearActions(),this.identity={sessionID:e.sessionID,profileRevision:e.profileRevision,modelToken:e.modelToken,generation:e.generation},this.latestProjection=null,this.desiredSteadyRole="idle",this.failedTokens.clear(),this.roleRecords.clear(),this.active={role:null,mode:"rest",token:null},this.lastActiveSignature=null;for(let t of["idle","listening","thinking","speaking","success","failure"]){let n=e.motions.get(t);if(!n)continue;let r=Ib(t),s=r?n.steadyClip??n.clip:n.clip,o=Lb(n.motionToken,r?"steady":"terminal"),a=this.actions.get(o)??[...this.actions.values()].find(l=>l.token===n.motionToken&&l.clip===s);if(a){this.roleRecords.set(t,a);continue}try{let l=this.mixer.clipAction(s,this.root),c={key:o,token:n.motionToken,clip:s,action:l};this.actions.set(o,c),this.roleRecords.set(t,c)}catch{this.reportFault(n.motionToken)}}}}project(e){if(this.disposed||!this.matchesIdentity(e))return;let t=this.latestProjection;if(!(!Number.isSafeInteger(e.projectionSequence)||e.projectionSequence<1||e.projectionSequence<(t?.projectionSequence??0)||t!==null&&e.projectionSequence===t.projectionSequence&&(!e.isReconciliation||this.sameProjection(e,t))))switch(this.latestProjection=e,e.phase){case"succeeded":this.desiredSteadyRole="idle",this.activateTerminal("success",e.causedBySequence);return;case"failed":this.desiredSteadyRole="idle",this.activateTerminal("failure",e.causedBySequence);return;case"idle":case"listening":case"transcribing":case"thinking":case"responding":case"speaking":case"stopped":this.desiredSteadyRole=Pb(e.phase),this.activateSteady(this.desiredSteadyRole,e.causedBySequence);return}}update(e){if(this.disposed||this.suspended||this.reducedMotion||!Number.isFinite(e)||e<0)return;let t=this.participatingActions();try{this.mixer.update(e),this.advanceTransition(e)}catch{this.transition=null;for(let n of t)this.reportFault(n.token);this.fallbackAfterFault()}}setSuspended(e){if(!(this.disposed||e===this.suspended)){if(this.suspended=e,e){this.clearTransition(!0),this.stopActiveAction();try{this.mixer.stopAllAction()}catch{}this.active={role:null,mode:"rest",token:null},this.completionGeneration+=1,this.resetRestPose(),this.emitActive(null,"rest",this.latestProjection?.causedBySequence??null);return}this.reconcileLatestProjection()}}setReducedMotion(e){if(!(this.disposed||e===this.reducedMotion)){if(this.reducedMotion=e,e){this.clearTransition(!0),this.stopActiveAction();try{this.mixer.stopAllAction()}catch{}this.active={role:null,mode:"rest",token:null},this.completionGeneration+=1,this.resetRestPose(),this.emitActive(null,"rest",this.latestProjection?.causedBySequence??null);return}this.reconcileLatestProjection()}}dispose(){if(!this.disposed){this.disposed=!0,this.completionGeneration+=1;try{this.mixer.removeEventListener("finished",this.finishedListener)}catch{}this.clearTransition(!0),this.stopActiveAction();try{this.mixer.stopAllAction()}catch{}for(let e of this.actions.values())this.uncache(e);try{this.mixer.uncacheRoot?.(this.root)}catch{}this.actions.clear(),this.roleRecords.clear(),this.identity=null,this.latestProjection=null,this.active={role:null,mode:"rest",token:null}}}activateSteady(e,t){if(this.reducedMotion||this.suspended||this.disposed)return;let n=this.resolveSteadyRole(e),r=n===null?null:this.recordForRole(n);if(!r){this.enterRest(t);return}let s=n;if(this.active.mode==="loop"&&this.active.token===r.token&&this.active.role===s)return;if(this.active.mode==="loop"&&this.active.token===r.token){this.clearTransition(!0),this.active={token:r.token,role:s,mode:"loop",action:r.action},this.emitActive(r.token,"loop",t,s);return}let o=this.active.mode==="rest"?null:this.recordForActive();if(this.active.mode==="one_shot"&&o===r){if(this.clearTransition(!0),!this.configureAndPlay(r,"loop")){this.fallbackAfterFault(t);return}this.completionGeneration+=1,this.active={token:r.token,role:s,mode:"loop",action:r.action},this.emitActive(r.token,"loop",t,s);return}if(this.clearTransition(!0),!this.configureAndPlay(r,"loop")){this.fallbackAfterFault(t);return}if(o&&o!==r){if(!this.safeFadeOut(o,.2)||!this.safeFadeIn(r,.2)){this.fallbackAfterFault(t);return}this.transition={source:o,target:r,remainingSeconds:.2}}this.completionGeneration+=1,this.active={token:r.token,role:s,mode:"loop",action:r.action},this.emitActive(r.token,"loop",t,s)}activateTerminal(e,t){if(this.reducedMotion||this.suspended||this.disposed)return;let n=this.recordForRole(e);if(!n){this.activateSteady(this.desiredSteadyRole,t);return}let r=this.active.mode==="rest"?null:this.recordForActive(),s=this.active.mode==="one_shot"&&r===n;if(this.clearTransition(!0),!this.configureAndPlay(n,"one_shot")){this.fallbackAfterFault(t);return}if(!s&&r&&r!==n){if(!this.safeFadeOut(r,.12)||!this.safeFadeIn(n,.12)){this.fallbackAfterFault(t);return}this.transition={source:r,target:n,remainingSeconds:.12}}this.completionGeneration+=1,this.active={token:n.token,role:e,mode:"one_shot",action:n.action},this.emitActive(n.token,"one_shot",t,e)}configureAndPlay(e,t){let n=t==="loop"?1/0:1,r=t==="loop"?hl:ul;try{return e.action.reset(),e.action.time!==void 0&&(e.action.time=0),e.action.setLoop(r,n),e.action.clampWhenFinished=t==="one_shot",e.action.enabled=!0,e.action.paused!==void 0&&(e.action.paused=!1),e.action.play(),!0}catch{return this.reportFault(e.token),!1}}safeFadeIn(e,t){try{return e.action.fadeIn(t),!0}catch{return this.reportFault(e.token),!1}}safeFadeOut(e,t){try{return e.action.fadeOut(t),!0}catch{return this.reportFault(e.token),!1}}safeStop(e){try{e.action.stop()}catch{}}finished(e){if(this.disposed||this.active.mode!=="one_shot"||this.active.action!==e.action)return;let t=e.action.getClip().duration;if(e.action.time!==void 0&&Number.isFinite(e.action.time)&&e.action.time<t-Number.EPSILON)return;let n=this.completionGeneration,r=e.action;queueMicrotask(()=>{this.disposed||n!==this.completionGeneration||this.active.mode!=="one_shot"||this.active.action!==r||this.activateSteady(this.desiredSteadyRole,this.latestProjection?.causedBySequence??null)})}reconcileLatestProjection(){if(this.reducedMotion||this.suspended||this.disposed)return;let e=this.latestProjection;e&&(e.phase==="succeeded"?this.activateTerminal("success",e.causedBySequence):e.phase==="failed"?this.activateTerminal("failure",e.causedBySequence):this.activateSteady(this.desiredSteadyRole,e.causedBySequence))}resolveSteadyRole(e){return this.recordForRole(e)?e:e!=="idle"&&this.recordForRole("idle")?"idle":null}recordForRole(e){let t=this.roleRecords.get(e);return t&&!this.failedTokens.has(t.token)?t:null}recordForActive(){return this.active.mode==="rest"||this.active.role===null?null:this.recordForRole(this.active.role)}participatingActions(){let e=new Map;if(this.transition)e.set(this.transition.source.key,this.transition.source),e.set(this.transition.target.key,this.transition.target);else if(this.active.mode!=="rest"){let t=this.recordForActive();t&&e.set(t.key,t)}return[...e.values()]}reportFault(e){if(this.failedTokens.has(e))return;this.failedTokens.add(e),this.clearTransition();let t=this.identity,n=this.latestProjection?.causedBySequence??null;if(t)try{this.onFault?.({...t,motionToken:e,code:"motion_runtime_failed",causedBySequence:n})}catch{}for(let[r,s]of this.actions)s.token===e&&(this.safeStop(s),this.uncache(s),this.actions.delete(r));for(let[r,s]of this.roleRecords)s.token===e&&this.roleRecords.delete(r);this.active.mode!=="rest"&&this.active.token===e&&(this.active={role:null,mode:"rest",token:null},this.completionGeneration+=1)}fallbackAfterFault(e=this.latestProjection?.causedBySequence??null){if(this.reducedMotion||this.disposed)return;let t=this.resolveSteadyRole(this.desiredSteadyRole);if(t){let n=this.recordForRole(t);if(n&&this.configureAndPlay(n,"loop")){this.active={token:n.token,role:t,mode:"loop",action:n.action},this.emitActive(n.token,"loop",e,t);return}}this.enterRest(e)}enterRest(e){this.clearTransition(!0),this.active.mode!=="rest"&&this.stopActiveAction(),this.active={role:null,mode:"rest",token:null},this.completionGeneration+=1,this.resetRestPose(),this.emitActive(null,"rest",e)}resetRestPose(){try{this.resetNormalizedPose()}catch{}}stopActiveAction(){if(this.active.mode==="rest")return;let e=this.recordForActive();e&&this.safeStop(e)}clearActions(){this.completionGeneration+=1,this.clearTransition(!0),this.stopActiveAction();try{this.mixer.stopAllAction()}catch{}for(let e of this.actions.values())this.uncache(e);try{this.mixer.uncacheRoot?.(this.root)}catch{}this.actions.clear(),this.roleRecords.clear()}uncache(e){try{this.mixer.uncacheAction?.(e.clip,this.root)}catch{}try{this.mixer.uncacheClip?.(e.clip)}catch{}}matchesIdentity(e){let t=this.identity;return t!==null&&t.sessionID===e.sessionID&&t.profileRevision===e.profileRevision&&t.modelToken===e.modelToken&&t.generation===e.generation}sameProjection(e,t){return t!==null&&e.phase===t.phase&&e.generationID===t.generationID&&(e.playbackID??null)===(t.playbackID??null)}emitActive(e,t,n,r=null){if(t==="rest"&&this.latestProjection===null)return;let s=`${e??"rest"}:${r??"none"}:${t}`;if(s===this.lastActiveSignature)return;this.lastActiveSignature=s;let o=this.identity;if(o)try{this.onActive?.({...o,motionToken:e,role:r,mode:t,causedBySequence:n})}catch{}}clearTransition(e=!1){let t=this.transition;this.transition=null,e&&t&&this.safeStop(t.source)}advanceTransition(e){let t=this.transition;t&&(t.remainingSeconds-=e,t.remainingSeconds<=0&&(this.transition=null))}};function Pb(i){return i==="listening"||i==="transcribing"?"listening":i==="thinking"||i==="responding"?"thinking":i==="speaking"?"speaking":"idle"}function Ib(i){return i==="idle"||i==="listening"||i==="thinking"||i==="speaking"}function Lb(i,e){return`${i}:${e}`}var wR=8192,AR=67108864;function mm(i,e){let t=e.filter(({x:s,y:o,z:a})=>[s,o,a].every(Number.isFinite)),n={x:0,y:0,z:0},r={x:0,y:0,z:0};for(let s of t)n.x=Math.min(n.x,s.x),n.y=Math.min(n.y,s.y),n.z=Math.min(n.z,s.z),r.x=Math.max(r.x,s.x),r.y=Math.max(r.y,s.y),r.z=Math.max(r.z,s.z);return{min:{x:i.min.x+n.x,y:i.min.y+n.y,z:i.min.z+n.z},max:{x:i.max.x+r.x,y:i.max.y+r.y,z:i.max.z+r.z},visibleMeshes:i.visibleMeshes}}function gm(i,e,t){let n=[i.min.x,i.min.y,i.min.z,i.max.x,i.max.y,i.max.z,e,t];if(i.visibleMeshes<1||!n.every(Number.isFinite)||!Number.isSafeInteger(e)||!Number.isSafeInteger(t)||e<=0||t<=0||e>8192||t>8192||e*t>67108864)throw new RangeError("camera fit requires finite visible bounds and viewport");let r=i.max.x-i.min.x,s=i.max.y-i.min.y,o=i.max.z-i.min.z;if(![r,s,o].every(Number.isFinite)||r<0||s<0||o<0||Math.max(r,s,o)<1e-4)throw new RangeError("camera fit requires non-degenerate ordered bounds");let a=e/t,l=30*Math.PI/180/2,c=s*1.1/2/Math.tan(l),u=r*1.1/2/(Math.tan(l)*a),h=Math.max(o*1.1,1e-4),d=h*.01,f=Math.max(c,u,.01)+h/2+d,g=i.min.y+s/2,m=Math.max(.01,f-h/2-d)*Math.tan(l),p=s*1.1/2,T=Math.max(0,m-p),b=u>c?T*.4:0,y={x:i.min.x+r/2,y:g+b,z:i.min.z+o/2},A=.01,w=Math.max(100,f+h/2+d),C={fovDegrees:30,aspect:a,target:y,position:{x:y.x,y:y.y,z:y.z+f},near:A,far:w};if(![f,A,w,...Object.values(y),...Object.values(C.position)].every(Number.isFinite))throw new RangeError("camera fit overflowed");return C}var Db=/^miller-avatar-local:\/\/app\/session\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.vrm$/u,Nb=8192,fs=64;function Ub(i){let e=Object.fromEntries(ds.map(t=>{let n=i?.getExpression(t);return[t,n!=null]}));return Object.freeze(e)}function _m(i,e,t){if(i)for(let n of ds)e[n]&&i.setValue(n,t[n])}function Ob(i){return i==="thinking"?{visible:!0,expression:"relaxed",weight:.35}:i==="failed"?{visible:!0,expression:"sad",weight:.55}:{visible:!0,expression:null,weight:0}}function Fb(i,e="1.0"){if(i?.meta?.metaVersion!=="1"||e!=="1.0")throw new Error("asset is not VRM 1.0")}function Bb(i){if(!Db.test(i))throw new Error("renderer rejected non-session asset URL")}function kb(i){if(i.length%4!==0)throw new RangeError("alpha probe requires RGBA pixels");let e=0;for(let t=3;t<i.length;t+=4)i[t]!==0&&(e+=1);return e}function Hb(i,e,t=typeof ResizeObserver=="function"?ResizeObserver:void 0){if(!t)return()=>{};let n=new t(()=>e());return n.observe(i),()=>n.disconnect()}function Vb(i){i.updateMatrixWorld(!0);let e=new kt,t=new Set,n=new Set,r=0,s=0;if(i.traverse(c=>{if(!(c instanceof Mt)||!jb(c))return;let u=(Array.isArray(c.material)?c.material:[c.material]).filter(d=>d.visible);if(u.length===0)return;let h=new kt().setFromObject(c);if(!h.isEmpty()){r+=1,e.union(h);for(let d of u){s+=1,d instanceof oh&&n.add(d);for(let f of Sm(d))Zb(f)&&t.add(f.source)}}}),r<1||s<1||e.isEmpty())throw new Error("renderer has no visible geometry with material bindings");let o=e.min,a=e.max;if(![o.x,o.y,o.z,a.x,a.y,a.z].every(Number.isFinite))throw new Error("avatar bounds are not finite");return{bounds:{min:{x:o.x,y:o.y,z:o.z},max:{x:a.x,y:a.y,z:a.z},visibleMeshes:r},visibleMeshes:r,decodedTextures:t.size,materialBindings:s,mtoonMaterials:n.size}}function UR(i,e){let t=Em(i);if(!t)return[];let n=[],r=new Set;for(let s of e.values())r.has(s.clip)||(r.add(s.clip),bm(s.clip,t,n));return n}function zb(i,e,t){let n=Em(i),r=new Map;if(!n)return r;for(let[s,o]of e){let a=$b(s)?o.steadyClip??o.clip:o.clip,l=[];bm(a,n,l),r.set(s,mm(t,l))}return r}function Gb(i){let e=i.humanoid,t=i.springBoneManager;e.resetNormalizedPose?.(),i.update(0),t?.reset?.(),i.scene.updateMatrixWorld(!0)}function Em(i){let e=i.humanoid,t=e?.normalizedHumanBones?.hips?.node?.name,n=e?.normalizedRestPose?.hips?.position,r=Array.isArray(n)?n:n?[n.x,n.y,n.z]:[];return typeof t!="string"||r.length!==3||!r.every(s=>typeof s=="number"&&Number.isFinite(s))?null:{hipsName:t,rest:r}}function bm(i,e,t){let n=i.tracks.find(o=>o.name===`${e.hipsName}.position`);if(!n||n.times.length===0)return;let r=n.values.length/n.times.length,s=n.createInterpolant?.isInterpolantFactoryMethodGLTFCubicSpline===!0;if(!(!s&&r!==3||s&&r!==9)){if(!s){for(let o=0;o<n.values.length;o+=r)_h(t,n.values,o,e.rest);return}Wb(n,e.rest,t)}}function Wb(i,e,t){for(let n=3;n<i.values.length;n+=9)_h(t,i.values,n,e);for(let n=0;n+1<i.times.length;n+=1){let r=i.times[n+1]-i.times[n];if(!Number.isFinite(r)||r<=0)continue;let s=n*9,o=(n+1)*9,a=new Set;for(let l=0;l<3;l+=1)for(let c of Xb(i.values[s+3+l],i.values[o+3+l],r*i.values[s+6+l],r*i.values[o+l]))a.add(c);for(let l of a){let c=[0,1,2].map(u=>qb(i.values[s+3+u],i.values[o+3+u],r*i.values[s+6+u],r*i.values[o+u],l));_h(t,c,0,e)}}}function Xb(i,e,t,n){let r=3*(2*i-2*e+t+n),s=2*(-3*i+3*e-2*t-n),o=t;if(![r,s,o].every(Number.isFinite))return[];if(Math.abs(r)<1e-12){if(Math.abs(s)<1e-12)return[];let c=-o/s;return c>0&&c<1?[c]:[]}let a=s*s-4*r*o;if(a<0)return[];let l=Math.sqrt(a);return[(-s-l)/(2*r),(-s+l)/(2*r)].filter(c=>c>0&&c<1&&Number.isFinite(c))}function qb(i,e,t,n,r){let s=r*r,o=s*r;return(2*o-3*s+1)*i+(o-2*s+r)*t+(-2*o+3*s)*e+(o-s)*n}function _h(i,e,t,n){let r=e[t]-n[0],s=e[t+1]-n[1],o=e[t+2]-n[2];[r,s,o].every(Number.isFinite)&&i.push({x:r,y:s,z:o})}var Fl=class{constructor(e,t){this.root=e;if(this.canvas=t?.canvas??globalThis.document.createElement("canvas"),this.loadVRMCandidate=t?.loadVRM??Yb,t)this.renderer=t.renderer;else{let r=this.canvas.getContext("webgl2",{alpha:!0,antialias:!0,powerPreference:"high-performance"});if(!r)throw new Error("webgl2 unavailable");this.renderer=new vl({alpha:!0,antialias:!0,canvas:this.canvas,context:r})}this.renderer.outputColorSpace=Tt,this.renderer.setClearColor(0,0),this.scene.add(new Zs(16777215,2699328,2));let n=new Ji(16777215,1.5);n.position.set(1,2,3),this.scene.add(n),e.replaceChildren(this.canvas),this.stopResizeObservation=t?()=>{}:Hb(e,()=>{this.resize(),this.reducedMotion&&this.avatar&&this.evidence&&(this.applyFramePresentation(0),this.renderer.render(this.scene,this.camera))}),this.resize()}root;canvas;renderer;loadVRMCandidate;scene=new Bs;camera=new Rt(30,1,.01,100);clock=new eo(!1);avatar;mixer;motionController;motionIdentity;motionRegistry=new Map;evidence;cameraBounds;motionBounds=new Map;reducedMotion=!1;mouthCuesEnabled=!0;mouthCapabilities=vm();mouthController;mouthTarget=null;suspended=!1;phase="idle";projectionSequence=0;motionFaultHandler;motionActiveHandler;viewport={width:0,height:0};stopResizeObservation;configure(e){let{reducedMotion:t,mouthCuesEnabled:n}=e,r=this.reducedMotion!==t;this.reducedMotion=t,this.mouthCuesEnabled=n,this.motionController?.setReducedMotion(t),t||this.suspended?this.clock.stop():this.clock.start(),(t||!n)&&(this.applyPhase(this.phase),this.clearMouth()),r&&this.fitToAvatar()}async loadModel(e,t){Bb(e);let{avatar:n,specVersion:r}=await this.loadVRMCandidate(e,t),s;try{Fb(n,r);let o=Vb(n.scene),a=Ub(n.expressionManager),l=new Ul(a),c=new to(n.scene);return s=new Ol({mixer:c,root:n.scene,resetNormalizedPose:()=>{Gb(n)},initialReducedMotion:this.reducedMotion,onFault:u=>this.motionFaultHandler?.(u),onActive:u=>{this.applyActiveMotionBounds(u),this.motionActiveHandler?.(u)}}),this.removeAvatar(),this.avatar=n,this.mouthCapabilities=a,this.mouthController=l,this.mixer=c,this.motionController=s,s=void 0,this.scene.add(n.scene),n.lookAt&&(n.lookAt.target=this.camera),this.evidence=o,this.cameraBounds=o.bounds,this.fitToAvatar(),{capabilities:{aa:this.mouthCapabilities.aa,vowels:this.mouthCapabilities,look_at:n.lookAt!==void 0,spring_bone:n.springBoneManager!==void 0,mtoon_materials:this.evidence.mtoonMaterials}}}catch(o){throw s?.dispose(),this.scene.remove(n.scene),vh(n.scene),o}}async loadMotion(e,t){if(Nl(e.url),!this.avatar)throw new Error("renderer has no admitted avatar");return pm(e,this.avatar,t)}replaceMotions(e,t){if(!this.avatar||!this.mixer||!this.motionController||!t)throw new Error("renderer has no admitted avatar");this.motionIdentity=t,this.motionRegistry=new Map(e),this.motionBounds=this.evidence?zb(this.avatar,e,this.evidence.bounds):new Map,this.cameraBounds=this.evidence?.bounds,this.motionController.replaceRegistry({...t,motions:e}),this.evidence&&this.fitToAvatar()}setSuspended(e){this.suspended=e,this.motionController?.setSuspended(e),e&&this.clearMouth(),e||this.reducedMotion?this.clock.stop():this.clock.start()}setMotionFaultHandler(e){this.motionFaultHandler=e}setMotionActiveHandler(e){this.motionActiveHandler=e}discardMotion(e){}renderOnce(){this.applyFramePresentation(0);let{width:e,height:t}=this.renderFrame();if(!this.avatar||!this.evidence)throw new Error("renderer has no admitted avatar");let n=this.probeAlpha();if(n<1)throw new Error("first frame alpha probe found no avatar pixels");return{viewport_width:e,viewport_height:t,visible_meshes:this.evidence.visibleMeshes,decoded_textures:this.evidence.decodedTextures,material_bindings:this.evidence.materialBindings,alpha_probe_pixels:n}}renderFrame(){let e=this.resize();if(!this.avatar||!this.evidence)throw new Error("renderer has no admitted avatar");return this.renderer.render(this.scene,this.camera),e}update(e){this.suspended||(this.motionController?.update(e),this.applyPhase(this.phase),this.setMouth(),this.maintainLookAtTarget(),this.reducedMotion||this.avatar?.update(e))}apply(e,t){switch(e.type){case"apply_mouth":{let r=ym(e.command.payload);this.reducedMotion||!this.mouthCuesEnabled||this.suspended||!xm(r)?this.clearMouth():this.mouthTarget=r;return}case"clear_mouth":this.clearMouth();return;case"apply_projection":this.phase=e.command.payload.phase,this.projectionSequence=e.command.payload.projection_sequence,this.projectMotion(e.command.payload,t??null);return;case"set_reduced_motion":this.configure({reducedMotion:e.enabled,mouthCuesEnabled:this.mouthCuesEnabled});return;case"set_mouth_cues_enabled":this.mouthCuesEnabled=e.enabled,e.enabled||this.clearMouth();return;case"reset":this.phase="idle",this.clearMouth(),this.projectionSequence=Math.min(Number.MAX_SAFE_INTEGER,this.projectionSequence+1),this.projectMotion({projection_sequence:this.projectionSequence,generation_id:null,phase:"idle",playback_id:null},t??null);return;case"reconcile":this.configure({reducedMotion:e.reducedMotion,mouthCuesEnabled:e.mouthCuesEnabled}),this.phase=e.phase;let n=ym({scalar:e.mouthScalar});this.reducedMotion||!this.mouthCuesEnabled||this.suspended||!xm(n)?this.clearMouth():this.mouthTarget=n,e.lastProjectionSequence!==null&&(this.projectionSequence=e.lastProjectionSequence,this.projectMotion({projection_sequence:e.lastProjectionSequence,generation_id:e.generationID,phase:e.phase,playback_id:e.playbackID},t??null,!0));return}}startClock(){!this.reducedMotion&&!this.suspended&&this.clock.start()}stopClock(){this.clock.stop()}dispose(){this.stopResizeObservation(),this.removeAvatar(),this.renderer.dispose(),this.renderer.forceContextLoss(),this.canvas.remove()}resize(){let e=Mm(this.root.clientWidth||1),t=Mm(this.root.clientHeight||1);return(e!==this.viewport.width||t!==this.viewport.height)&&(this.viewport={width:e,height:t},this.renderer.setSize(e,t,!1),this.evidence&&this.fitToAvatar()),{width:e,height:t}}fitToAvatar(){let e=this.reducedMotion?this.evidence?.bounds:this.cameraBounds??this.evidence?.bounds;if(!e)return;let t=gm(e,this.viewport.width,this.viewport.height);this.camera.aspect=t.aspect,this.camera.near=t.near,this.camera.far=t.far,this.camera.position.set(t.position.x,t.position.y,t.position.z),this.camera.lookAt(t.target.x,t.target.y,t.target.z),this.camera.updateProjectionMatrix()}applyActiveMotionBounds(e){this.cameraBounds=e.role===null?this.evidence?.bounds:this.motionBounds.get(e.role)??this.evidence?.bounds,!this.reducedMotion&&this.evidence&&this.fitToAvatar()}probeAlpha(){let e=new mn(fs,fs,{depthBuffer:!0,format:jt,stencilBuffer:!1,type:ln}),t=this.renderer.getRenderTarget(),n=this.renderer.getClearColor(new he),r=this.renderer.getClearAlpha(),s=new Uint8Array(fs*fs*4);try{return this.renderer.setRenderTarget(e),this.renderer.setClearColor(0,0),this.renderer.clear(!0,!0,!0),this.renderer.render(this.scene,this.camera),this.renderer.readRenderTargetPixels(e,0,0,fs,fs,s),kb(s)}finally{this.renderer.setRenderTarget(t),this.renderer.setClearColor(n,r),e.dispose()}}setMouth(){let e=this.avatar?.expressionManager,t=this.reducedMotion||!this.mouthCuesEnabled||!this.mouthTarget?this.mouthController?.clear()??hs():this.mouthController?.update(this.mouthTarget)??hs();_m(e,this.mouthCapabilities,t)}clearMouth(){this.mouthTarget=null;let e=this.mouthController?.clear()??hs();_m(this.avatar?.expressionManager,this.mouthCapabilities,e)}applyPhase(e){if(!this.avatar)return;let t=Ob(e);this.avatar.scene.visible=t.visible;let n=this.avatar.expressionManager;if(n){for(let r of["relaxed","sad"])n.getExpression(r)&&n.setValue(r,0);t.expression&&n.getExpression(t.expression)&&n.setValue(t.expression,t.weight)}}removeAvatar(){this.clearMouth(),this.mouthController=void 0,this.mouthCapabilities=vm(),this.motionController?.dispose(),this.motionController=void 0,this.motionIdentity=void 0,this.motionRegistry=new Map;let e=this.avatar;e&&(this.scene.remove(e.scene),vh(e.scene)),this.mixer=void 0,this.avatar=void 0,this.evidence=void 0,this.cameraBounds=void 0,this.motionBounds=new Map}applyFramePresentation(e){this.applyPhase(this.phase),this.setMouth(),this.maintainLookAtTarget()}maintainLookAtTarget(){this.avatar?.lookAt&&(this.avatar.lookAt.target=this.camera)}projectMotion(e,t,n=!1){let r=this.motionIdentity;r&&this.motionController?.project({...r,projectionSequence:e.projection_sequence,phase:e.phase,generationID:e.generation_id,playbackID:e.playback_id,isReconciliation:n,causedBySequence:t})}};function vm(){return Object.freeze({aa:!1,ih:!1,ou:!1,ee:!1,oh:!1})}function ym(i){return i.vowels?Object.freeze({scalar:i.scalar,vowels:Object.freeze({...i.vowels})}):Object.freeze({scalar:i.scalar})}function xm(i){let e=i.vowels;return e?ds.some(t=>e[t]>0):i.scalar>0}async function Yb(i,e){let t=new ts;return t.register(n=>new Bp(n)),new Promise((n,r)=>{let s=!1,o=l=>s?!1:(s=!0,e.removeEventListener("abort",a),l(),!0),a=()=>o(()=>r(new DOMException("asset load aborted","AbortError")));t.load(i,l=>{let c=l.userData.vrm;if(!c){o(()=>r(new Error("missing VRM payload")));return}let u=l.parser.json.extensions?.VRMC_vrm?.specVersion;o(()=>n({avatar:c,specVersion:u}))||vh(c.scene)},void 0,l=>o(()=>r(l))),e.aborted?a():e.addEventListener("abort",a,{once:!0})})}function jb(i){for(let e=i;e;e=e.parent)if(!e.visible)return!1;return!0}function Sm(i){let e=new Set;for(let n of Object.values(i))n instanceof wt&&e.add(n);let t=i.uniforms;for(let n of Object.values(t??{}))n.value instanceof wt&&e.add(n.value);return e}function Zb(i){return i.source.data!==null&&i.source.data!==void 0}function $b(i){return i==="idle"||i==="listening"||i==="thinking"||i==="speaking"}function vh(i){let e=new Set,t=new Set,n=new Set;i.traverse(r=>{if(r instanceof Mt){e.add(r.geometry);for(let s of Array.isArray(r.material)?r.material:[r.material]){t.add(s);for(let o of Sm(s))n.add(o)}}});for(let r of n)r.dispose();for(let r of t)r.dispose();for(let r of e)r.dispose()}function Mm(i){return Math.min(Nb,Math.max(1,Math.floor(i)))}var Yn={commandSchema:"miller-avatar.presentation-command/v2",observationSchema:"miller-avatar.presentation-observation/v2",maximumMessageBytes:16384,maximumContainerDepth:8,maximumArrayLength:64,maximumSafeInteger:Number.MAX_SAFE_INTEGER},jn=["idle","listening","thinking","speaking","success","failure"],Tm=["idle","listening","thinking","speaking"],wm=["success","failure"],Am=["ready","missing","rejected"],Rm=["ready","missing","rejected","load_failed","timed_out","runtime_failed"],Cm=["loop","one_shot","rest"],Pm=["motion_rejected","resource_limit","bookmark_unavailable","quarantined","motion_load_failed","motion_load_timeout","motion_runtime_failed","cancelled"],yh=["idle","listening","transcribing","thinking","responding","speaking","succeeded","stopped","failed"],Im=["visible","occluded","hidden"],Lm=["stopped","cancelled","replaced","operator"],xh=["operator","hidden_before_live","failure","retry","termination"],Dm=["bridge_invalid","renderer_unavailable","webgl_unavailable","wrapper_timeout","asset_rejected","asset_load_failed","asset_load_timeout","render_failed","context_lost","scheme_rejected","policy_violation","resource_limit","disposed_during_operation"],Nm=["startup","configure","load","render","suspend","resume","dispose","scheme","policy"],Mh=["aa","ih","ou","ee","oh"];function Dn(i,e){return e.type==="dispose"&&(i==="disposing"||i==="disposed")?{state:i}:e.type==="dispose"&&i!=="disposed"?{state:"disposing",effect:"begin_disposal"}:e.type==="fail"&&!["disposing","disposed","failed"].includes(i)?{state:"failed"}:i==="booting"&&e.type==="configured"?{state:"ready"}:i==="ready"&&e.type==="load_started"?{state:"loading"}:i==="loading"&&e.type==="first_frame"?{state:"live"}:i==="live"&&e.type==="suspend"?{state:"suspended"}:i==="suspended"&&e.type==="resume"?{state:"live"}:i==="disposing"&&e.type==="disposed"?{state:"disposed"}:{state:i,effect:"rejected"}}function Um(){return{generationID:null,phase:"idle",playbackID:null,mouthScalar:0,mouthVowels:null,mouthCuesEnabled:!0,reducedMotion:!1,suspended:!1,terminated:!1}}function Eo(i,e){if(i.terminated)return Zn(i);if(e.type==="reconcile_presentation")return Kb(i,e);if(e.type==="project_phase")return Jb(i,e);if(e.type==="set_mouth")return Qb(i,e);if(e.type==="set_policy")return tS(i,e.payload);if(e.type==="reset")return nS(i,e.payload.generation_id,e.payload.reason);if(e.type==="suspend"){if(i.suspended)return e.visibility==="hidden"?cn(Bl(i),[]):Zn(i);let t=ps({...i,suspended:!0});return e.visibility==="hidden"&&(t=Bl(t)),cn(t,[{type:"clear_mouth"}])}if(e.type==="resume"){if(!i.suspended)return Zn(i);let t=ps({...i,suspended:!1});return cn(t,[{type:"reconcile",lastProjectionSequence:t.lastProjectionSequence??null,generationID:t.generationID,phase:t.phase,playbackID:t.playbackID,mouthScalar:t.mouthScalar,mouthCuesEnabled:t.mouthCuesEnabled,reducedMotion:t.reducedMotion}])}return e.type==="renderer_failed"||e.type==="dispose"?cn(Bl({...i,terminated:!0}),[{type:"clear_mouth"}]):Zn(i)}function Jb(i,e){let t=e.payload;if(!Fm(t.phase,t.generation_id,t.playback_id)||!Number.isSafeInteger(t.projection_sequence)||t.projection_sequence<1||t.projection_sequence>Number.MAX_SAFE_INTEGER||t.projection_sequence<=(i.lastProjectionSequence??0))return Zn(i);let n=t.generation_id!==i.generationID||t.playback_id!==i.playbackID||t.phase==="stopped"||t.phase==="succeeded"||t.phase==="failed",r={...i,lastProjectionSequence:t.projection_sequence,generationID:t.generation_id,phase:t.phase,playbackID:t.playback_id};if(n&&(r=Om(r)),i.suspended)return cn(r,[]);let s=n?[{type:"clear_mouth"}]:[];return s.push({type:"apply_projection",command:e}),cn(r,s)}function Kb(i,e){let t=e.payload;if(t.last_projection_sequence!==null&&(!Number.isSafeInteger(t.last_projection_sequence)||t.last_projection_sequence<1||t.last_projection_sequence>Number.MAX_SAFE_INTEGER)||i.lastProjectionSequence!==void 0&&(t.last_projection_sequence===null||t.last_projection_sequence<i.lastProjectionSequence)||!Fm(t.phase,t.generation_id,t.playback_id))return Zn(i);let n=t.generation_id===i.generationID&&t.playback_id===i.playbackID,r=ps({...i,generationID:t.generation_id,phase:t.phase,playbackID:t.playback_id,mouthCuesEnabled:t.mouth_cues_enabled,reducedMotion:t.reduced_motion,suspended:!1});return n||(delete r.lastCueIndex,delete r.lastPlaybackOffsetMilliseconds),t.last_projection_sequence===null?delete r.lastProjectionSequence:r.lastProjectionSequence=t.last_projection_sequence,cn(r,[{type:"reconcile",lastProjectionSequence:t.last_projection_sequence,generationID:t.generation_id,phase:t.phase,playbackID:t.playback_id,mouthScalar:0,mouthCuesEnabled:r.mouthCuesEnabled,reducedMotion:t.reduced_motion}])}function Qb(i,e){let t=e.payload,n=Object.hasOwn(t,"vowels")?t.vowels:null;if(!Number.isSafeInteger(t.cue_index)||t.cue_index<1||t.cue_index>Number.MAX_SAFE_INTEGER||!Number.isSafeInteger(t.playback_offset_ms)||t.playback_offset_ms<0||t.playback_offset_ms>Number.MAX_SAFE_INTEGER||t.playback_offset_ms>864e5||!Number.isFinite(t.scalar)||t.scalar<0||t.scalar>1||n!==null&&!eS(n)||i.phase!=="speaking"||t.generation_id!==i.generationID||t.playback_id!==i.playbackID||t.cue_index<=(i.lastCueIndex??0)||t.playback_offset_ms<(i.lastPlaybackOffsetMilliseconds??0))return Zn(i);let r={...i,lastCueIndex:t.cue_index,lastPlaybackOffsetMilliseconds:t.playback_offset_ms};return i.suspended||i.reducedMotion||!i.mouthCuesEnabled?cn(ps(r),[]):cn({...r,mouthScalar:t.scalar,mouthVowels:n},[{type:"apply_mouth",command:e}])}function eS(i){return[i.aa,i.ih,i.ou,i.ee,i.oh].every(e=>Number.isFinite(e)&&e>=0&&e<=1)}function tS(i,e){let t=e.reduced_motion,n=e.mouth_cues_enabled,r=t!==i.reducedMotion,s=n!==i.mouthCuesEnabled;if(!r&&!s)return Zn(i);let o={...i,reducedMotion:t,mouthCuesEnabled:n},a=t||!n;if(a&&(o=ps(o)),i.suspended)return cn(o,[]);let l=[];return r&&l.push({type:"set_reduced_motion",enabled:t}),s&&l.push({type:"set_mouth_cues_enabled",enabled:n}),a&&l.push({type:"clear_mouth"}),cn(o,l)}function nS(i,e,t){if(!(e===null&&t==="operator")&&e!==i.generationID)return Zn(i);let n=Bl({...i,generationID:null,phase:"idle"});return i.suspended?cn(n,[]):cn(n,[{type:"clear_mouth"},{type:"reset",generationID:e,reason:t}])}function Bl(i){return{...Om(i),playbackID:null}}function Om(i){let e=ps({...i});return delete e.lastCueIndex,delete e.lastPlaybackOffsetMilliseconds,e}function ps(i){return{...i,mouthScalar:0,mouthVowels:null}}function Fm(i,e,t){return i==="speaking"?e!==null&&t!==null:["thinking","responding","succeeded","stopped","failed"].includes(i)?e!==null&&t===null:e===null&&t===null}function Zn(i){return{state:i,effects:[]}}function cn(i,e){return{state:i,effects:e}}var bo=class extends Error{constructor(t){super(t);this.code=t;this.name="BridgeValidationError"}code},kl=class{constructor(e){this.sessionID=e;un(e)}sessionID;nextSequence=1;lastProjectionSequence;activeGenerationID=null;activePlaybackID=null;lastCueIndex;lastPlaybackOffsetMilliseconds;hasLoadedProfile=!1;disposed=!1;dispose(){this.disposed=!0,this.clearActiveLease()}decode(e){this.disposed&&_e("disposed");let t=Wm(e);ht(t,["schema","session_id","sequence","type","payload"]),Li(t.schema)!==Yn.commandSchema&&_e("invalid_value");let n=un(t.session_id);n!==this.sessionID&&_e("stale_session");let r=ut(t.sequence,1);r!==this.nextSequence&&_e("invalid_sequence");let s=Li(t.type),o=Ii(t.payload),a=iS(s,o);return this.accept(a),this.nextSequence+=1,a.type==="dispose"&&this.dispose(),{session_id:n,sequence:r,command:a}}accept(e){switch(e.type){case"load_profile":this.hasLoadedProfile&&_e("invalid_sequence"),this.hasLoadedProfile=!0;return;case"project_phase":{let t=e.payload;this.lastProjectionSequence!==void 0&&t.projection_sequence<=this.lastProjectionSequence&&_e("invalid_sequence");let n=t.generation_id!==this.activeGenerationID||t.playback_id!==this.activePlaybackID||t.phase!=="speaking";this.lastProjectionSequence=t.projection_sequence,this.activeGenerationID=t.generation_id,this.activePlaybackID=t.playback_id,n&&this.clearCueLease();return}case"reconcile_presentation":{let t=e.payload;(this.lastProjectionSequence!==void 0&&t.last_projection_sequence===null||this.lastProjectionSequence!==void 0&&t.last_projection_sequence!==null&&t.last_projection_sequence<this.lastProjectionSequence)&&_e("invalid_sequence"),this.lastProjectionSequence=t.last_projection_sequence??void 0,this.activeGenerationID=t.generation_id,this.activePlaybackID=t.playback_id,this.clearCueLease();return}case"set_mouth":{let t=e.payload;(t.generation_id!==this.activeGenerationID||t.playback_id!==this.activePlaybackID||t.cue_index<=(this.lastCueIndex??0)||t.playback_offset_ms<(this.lastPlaybackOffsetMilliseconds??0))&&_e("invalid_sequence"),this.lastCueIndex=t.cue_index,this.lastPlaybackOffsetMilliseconds=t.playback_offset_ms;return}case"reset":(e.payload.generation_id===null||e.payload.generation_id===this.activeGenerationID)&&this.clearActiveLease();return;case"set_visibility":e.payload.visibility==="hidden"&&this.revokePlaybackLease();return;case"dispose":this.clearActiveLease();return;default:return}}clearActiveLease(){this.activeGenerationID=null,this.revokePlaybackLease()}revokePlaybackLease(){this.activePlaybackID=null,this.clearCueLease()}clearCueLease(){this.lastCueIndex=void 0,this.lastPlaybackOffsetMilliseconds=void 0}},Bm=class{constructor(e,t,n){this.sessionID=e;un(e),t!==void 0&&this.setExpectedProfile(t,n)}sessionID;nextSequence=1;lastFrames;lastUpdates;lastRenders;activeProfileRevision;activeModelToken;activeProfileLoadSequence;expectedProfile;expectedProfileLoadSequence;expectedPhaseCauseSequence;expectedMotionBindings={};hasDisposed=!1;setExpectedProfile(e,t){this.expectedProfile=e??void 0,this.expectedProfileLoadSequence=t??void 0,this.expectedMotionBindings=e?.motion_bindings??{}}setExpectedProfileLoadSequence(e){this.expectedProfileLoadSequence=e??void 0}setExpectedPhaseCauseSequence(e){this.expectedPhaseCauseSequence=e??void 0}decode(e){this.hasDisposed&&_e("disposed");let t=Wm(e);ht(t,["schema","session_id","sequence","caused_by_sequence","type","payload"]),Li(t.schema)!==Yn.observationSchema&&_e("invalid_value");let n=un(t.session_id);n!==this.sessionID&&_e("stale_session");let r=ut(t.sequence,1);r!==this.nextSequence&&_e("invalid_sequence");let s=t.caused_by_sequence===null?null:ut(t.caused_by_sequence,1),o=Li(t.type),a=Ii(t.payload),l=rS(o,a);return this.accept(l,s),this.nextSequence+=1,l.type==="disposed"&&(this.hasDisposed=!0),{session_id:n,sequence:r,caused_by_sequence:s,observation:l}}accept(e,t){switch(e.type){case"profile_model_loaded":{t===null&&_e("invalid_sequence"),this.expectedProfileLoadSequence!==void 0&&t!==this.expectedProfileLoadSequence&&_e("invalid_sequence"),this.activeProfileRevision!==void 0&&_e("invalid_sequence"),this.expectedProfile!==void 0&&(this.expectedProfile.profile_revision!==e.payload.profile_revision||this.expectedProfile.model_token!==e.payload.model_token)&&_e("stale_session"),this.activeProfileRevision=e.payload.profile_revision,this.activeModelToken=e.payload.model_token,this.activeProfileLoadSequence=t;return}case"first_frame":this.requireProfileLoadCause(t),this.requireIdentity(e.payload.profile_revision,e.payload.model_token,t);return;case"motion_status":e.payload.status!=="runtime_failed"&&this.requireProfileLoadCause(t),this.requireIdentity(e.payload.profile_revision,e.payload.model_token,t,!1),this.requireMotionIdentity(e.payload.role,e.payload.motion_token,e.payload.status);return;case"motion_active":this.expectedPhaseCauseSequence!==void 0&&t!==this.expectedPhaseCauseSequence&&_e("invalid_sequence"),this.requireIdentity(e.payload.profile_revision,e.payload.model_token,t,!1),this.requireActiveMotionIdentity(e.payload);return;case"suspended":case"resumed":this.acceptCounters(e.payload.frames,e.payload.updates,e.payload.renders);return;default:return}}requireIdentity(e,t,n,r=!0){(r&&!this.profileLoadCauseMatches(n)||n===null||this.activeProfileRevision!==e||this.activeModelToken!==t)&&_e("stale_session")}profileLoadCauseMatches(e){return e!==null&&this.activeProfileLoadSequence!==void 0&&e===this.activeProfileLoadSequence}requireProfileLoadCause(e){(e===null||this.activeProfileLoadSequence===void 0||e!==this.activeProfileLoadSequence)&&_e("invalid_sequence")}requireMotionIdentity(e,t,n){let r=Object.keys(this.expectedMotionBindings),s=this.expectedMotionBindings[e];if(s===void 0){if(r.length===0)return;_e("invalid_value")}switch(s.status){case"ready":(s.token===null||t!==s.token||!["ready","load_failed","timed_out","runtime_failed"].includes(n))&&_e("invalid_value");return;case"missing":(n!=="missing"||t!==null)&&_e("invalid_value");return;case"rejected":(n!=="rejected"||t!==null)&&_e("invalid_value");return;default:return}}requireActiveMotionIdentity(e){if(e.mode==="rest")return;let t=e.role===null?void 0:this.expectedMotionBindings[e.role];Object.keys(this.expectedMotionBindings).length!==0&&(t===void 0||t.status!=="ready"||t.token===null||e.motion_token!==t.token)&&_e("invalid_value")}acceptCounters(e,t,n){(this.lastFrames!==void 0&&e<this.lastFrames||this.lastUpdates!==void 0&&t<this.lastUpdates||this.lastRenders!==void 0&&n<this.lastRenders)&&_e("invalid_sequence"),this.lastFrames=e,this.lastUpdates=t,this.lastRenders=n}},km=["generation_id","playback_id","cue_index","playback_offset_ms","scalar"],Hm=["aa","look_at","spring_bone","mtoon_materials"];function Vm(i){return{generation_id:un(i.generation_id),playback_id:un(i.playback_id),cue_index:ut(i.cue_index,1),playback_offset_ms:ut(i.playback_offset_ms,0,864e5),scalar:ms(i.scalar,0,1)}}function iS(i,e){switch(i){case"configure":{ht(e,["profile","reduced_motion","mouth_cues_enabled"]);let t=Li(e.profile);return t!=="lightweight"&&_e("invalid_value"),{type:i,payload:{profile:t,reduced_motion:Dt(e.reduced_motion),mouth_cues_enabled:Dt(e.mouth_cues_enabled)}}}case"load_profile":{ht(e,["profile_revision","model_token","motion_bindings"]);let t=ut(e.profile_revision,1),n=un(e.model_token),r=Ii(e.motion_bindings);ht(r,jn);let s={};for(let o of jn){let a=Ii(r[o]);ht(a,["status","token"]);let l=Zt(a.status,Am),c=Pi(a.token);l==="ready"&&c===null&&_e("invalid_value"),l!=="ready"&&c!==null&&_e("invalid_value"),s[o]={status:l,token:c}}return{type:i,payload:{profile_revision:t,model_token:n,motion_bindings:s}}}case"project_phase":{ht(e,["projection_sequence","generation_id","phase","playback_id"]);let t=Zt(e.phase,yh),n=Pi(e.generation_id),r=Pi(e.playback_id);return zm(t,n,r),{type:i,payload:{projection_sequence:ut(e.projection_sequence,1),generation_id:n,phase:t,playback_id:r}}}case"reconcile_presentation":{ht(e,["last_projection_sequence","generation_id","phase","playback_id","reduced_motion","mouth_cues_enabled"]);let t=e.last_projection_sequence===null?null:ut(e.last_projection_sequence,1),n=Pi(e.generation_id),r=Zt(e.phase,yh),s=Pi(e.playback_id);return zm(r,n,s),{type:i,payload:{last_projection_sequence:t,generation_id:n,phase:r,playback_id:s,reduced_motion:Dt(e.reduced_motion),mouth_cues_enabled:Dt(e.mouth_cues_enabled)}}}case"set_visibility":return ht(e,["visibility"]),{type:i,payload:{visibility:Zt(e.visibility,Im)}};case"set_policy":return ht(e,["reduced_motion","mouth_cues_enabled"]),{type:i,payload:{reduced_motion:Dt(e.reduced_motion),mouth_cues_enabled:Dt(e.mouth_cues_enabled)}};case"set_mouth":return Object.hasOwn(e,"vowels")?(ht(e,[...km,"vowels"]),{type:i,payload:{...Vm(e),vowels:oS(e.vowels)}}):(ht(e,km),{type:i,payload:Vm(e)});case"reset":{ht(e,["generation_id","reason"]);let t=Pi(e.generation_id),n=Zt(e.reason,Lm);return t===null&&n!=="operator"&&_e("invalid_value"),{type:i,payload:{generation_id:t,reason:n}}}case"dispose":return ht(e,["reason"]),{type:i,payload:{reason:Zt(e.reason,xh)}};default:return _e("invalid_value")}}function rS(i,e){switch(i){case"wrapper_ready":return ht(e,["bridge_version"]),ut(e.bridge_version)!==2&&_e("invalid_value"),{type:i,payload:{bridge_version:2}};case"renderer_ready":{ht(e,["webgl"]);let t=Li(e.webgl);return t!=="webgl2"&&_e("invalid_value"),{type:i,payload:{webgl:t}}}case"profile_model_loaded":{ht(e,["profile_revision","model_token","capabilities"]);let t=Ii(e.capabilities);if(Object.hasOwn(t,"vowels")){ht(t,[...Hm,"vowels"]);let n=aS(t.vowels);return Dt(t.aa)!==n.aa&&_e("invalid_value"),{type:i,payload:{profile_revision:ut(e.profile_revision,1),model_token:un(e.model_token),capabilities:{aa:Dt(t.aa),look_at:Dt(t.look_at),spring_bone:Dt(t.spring_bone),mtoon_materials:ut(t.mtoon_materials,0,10240),vowels:n}}}}return ht(t,Hm),{type:i,payload:{profile_revision:ut(e.profile_revision,1),model_token:un(e.model_token),capabilities:{aa:Dt(t.aa),look_at:Dt(t.look_at),spring_bone:Dt(t.spring_bone),mtoon_materials:ut(t.mtoon_materials,0,10240)}}}}case"first_frame":return ht(e,["profile_revision","model_token","viewport_width","viewport_height","visible_meshes","decoded_textures","material_bindings","alpha_probe_pixels"]),{type:i,payload:{profile_revision:ut(e.profile_revision,1),model_token:un(e.model_token),viewport_width:ut(e.viewport_width,1,8192),viewport_height:ut(e.viewport_height,1,8192),visible_meshes:ut(e.visible_meshes,1,40960),decoded_textures:ut(e.decoded_textures,0,1280),material_bindings:ut(e.material_bindings,1,10240),alpha_probe_pixels:ut(e.alpha_probe_pixels,1,4096)}};case"motion_status":{ht(e,["profile_revision","model_token","motion_token","role","status","motion_code"]);let t=Zt(e.role,jn),n=Zt(e.status,Rm),r=Pi(e.motion_token),s=lS(e.motion_code);switch(n){case"ready":case"missing":case"rejected":(n==="ready"!=(r!==null)||s!==null)&&_e("invalid_value");break;case"load_failed":(r===null||s!=="motion_load_failed")&&_e("invalid_value");break;case"timed_out":(r===null||s!=="motion_load_timeout")&&_e("invalid_value");break;case"runtime_failed":(r===null||s!=="motion_runtime_failed")&&_e("invalid_value");break;default:return _e("invalid_value")}return{type:i,payload:{profile_revision:ut(e.profile_revision,1),model_token:un(e.model_token),motion_token:r,role:t,status:n,motion_code:s}}}case"motion_active":{ht(e,["profile_revision","model_token","motion_token","role","mode"]);let t=Zt(e.mode,Cm),n=Pi(e.motion_token),r=cS(e.role,jn);switch(t){case"rest":(n!==null||r!==null)&&_e("invalid_value");break;case"loop":(n===null||r===null||!Tm.includes(r))&&_e("invalid_value");break;case"one_shot":(n===null||r===null||!wm.includes(r))&&_e("invalid_value");break;default:return _e("invalid_value")}return{type:i,payload:{profile_revision:ut(e.profile_revision,1),model_token:un(e.model_token),motion_token:n,role:r,mode:t}}}case"suspended":{ht(e,["visibility","frames","updates","renders"]);let t=Zt(e.visibility,["occluded","hidden"]);return{type:i,payload:{visibility:t,frames:ut(e.frames),updates:ut(e.updates),renders:ut(e.renders)}}}case"resumed":return ht(e,["frames","updates","renders"]),{type:i,payload:{frames:ut(e.frames),updates:ut(e.updates),renders:ut(e.renders)}};case"disposed":return ht(e,["reason"]),{type:i,payload:{reason:Zt(e.reason,xh)}};case"failed":return ht(e,["code","operation"]),{type:i,payload:{code:Zt(e.code,Dm),operation:Zt(e.operation,Nm)}};default:return _e("invalid_value")}}function Wm(i){let e=typeof i=="string"?new TextEncoder().encode(i):i;e.byteLength>Yn.maximumMessageBytes&&_e("message_too_large");let t;try{t=new TextDecoder("utf-8",{fatal:!0}).decode(e)}catch{return _e("invalid_json")}let n,r;try{r=sS(t),n=JSON.parse(t)}catch{return _e("invalid_json")}return r&&_e("duplicate_key"),Eh(n,0),Ii(n)}function sS(i){let e=0,t=!1;if(n(),l(),e!==i.length)throw new SyntaxError("unexpected trailing JSON input");return t;function n(){switch(l(),i[e]){case"{":r();return;case"[":s();return;case'"':o();return;default:a()}}function r(){e+=1,l();let c=new Set;if(i[e]==="}"){e+=1;return}for(;;){if(l(),i[e]!=='"')throw new SyntaxError("object key must be a string");let u=o();if(c.has(u)&&(t=!0),c.add(u),l(),i[e]!==":")throw new SyntaxError("object key is missing a value");if(e+=1,n(),l(),i[e]==="}"){e+=1;return}if(i[e]!==",")throw new SyntaxError("object is missing a separator");e+=1}}function s(){if(e+=1,l(),i[e]==="]"){e+=1;return}for(;;){if(n(),l(),i[e]==="]"){e+=1;return}if(i[e]!==",")throw new SyntaxError("array is missing a separator");e+=1}}function o(){let c=e;for(e+=1;e<i.length;){let u=i[e];if(u==='"')return e+=1,JSON.parse(i.slice(c,e));if(u==="\\"){e+=2;continue}if(u<" ")throw new SyntaxError("control character in string");e+=1}throw new SyntaxError("unterminated string")}function a(){let c=e;for(;e<i.length&&!/[\s,\]}]/u.test(i[e]);)e+=1;if(e===c)throw new SyntaxError("missing JSON value")}function l(){for(;/[\t\n\r ]/u.test(i[e]??"");)e+=1}}function Eh(i,e){if(Array.isArray(i)){let t=e+1;(t>Yn.maximumContainerDepth||i.length>Yn.maximumArrayLength)&&_e("invalid_shape");for(let n of i)Eh(n,t);return}if(Xm(i)){let t=e+1;t>Yn.maximumContainerDepth&&_e("invalid_shape");for(let[n,r]of Object.entries(i))Gm(n),Eh(r,t);return}if(typeof i=="string"){Gm(i);return}i!==null&&typeof i!="boolean"&&(typeof i!="number"||!Number.isFinite(i))&&_e("invalid_value")}function Ii(i){return Xm(i)||_e("invalid_shape"),i}function Xm(i){return typeof i=="object"&&i!==null&&!Array.isArray(i)}function ht(i,e){let t=Object.keys(i).sort(),n=[...e].sort();(t.length!==n.length||t.some((r,s)=>r!==n[s]))&&_e("invalid_keys")}function Li(i){return typeof i!="string"&&_e("invalid_value"),i}function Dt(i){return typeof i!="boolean"&&_e("invalid_value"),i}function ut(i,e=0,t=Yn.maximumSafeInteger){return(typeof i!="number"||!Number.isSafeInteger(i)||i<e||i>t)&&_e("invalid_value"),i}function ms(i,e,t){return(typeof i!="number"||!Number.isFinite(i)||i<e||i>t)&&_e("invalid_value"),i}function un(i){let e=Li(i);return/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u.test(e)||_e("invalid_value"),e}function oS(i){let e=Ii(i);return ht(e,Mh),{aa:ms(e.aa,0,1),ih:ms(e.ih,0,1),ou:ms(e.ou,0,1),ee:ms(e.ee,0,1),oh:ms(e.oh,0,1)}}function aS(i){let e=Ii(i);return ht(e,Mh),{aa:Dt(e.aa),ih:Dt(e.ih),ou:Dt(e.ou),ee:Dt(e.ee),oh:Dt(e.oh)}}function Pi(i){return i===null?null:un(i)}function lS(i){if(i===null)return null;let e=Zt(i,Pm);return e==="cancelled"&&_e("invalid_value"),e}function cS(i,e){return i===null?null:Zt(i,e)}function Zt(i,e){let t=Li(i);return e.includes(t)||_e("invalid_value"),t}function zm(i,e,t){if(i==="speaking"){(e===null||t===null)&&_e("invalid_value");return}if(["thinking","responding","succeeded","stopped","failed"].includes(i)){(e===null||t!==null)&&_e("invalid_value");return}(e!==null||t!==null)&&_e("invalid_value")}function Gm(i){(new TextEncoder().encode(i).byteLength>64||/[\u0000-\u001f\u007f]/u.test(i))&&_e("invalid_value")}function _e(i){throw new bo(i)}var Hl=class{constructor(e,t,n,r,s={}){this.sessionID=e;this.backend=t;this.scheduler=n;this.post=r;if(this.decoder=new kl(e),this.loadTimeoutMilliseconds=s.loadTimeoutMilliseconds??15e3,!Number.isSafeInteger(this.loadTimeoutMilliseconds)||this.loadTimeoutMilliseconds<=0)throw new RangeError("load timeout must be a positive safe integer");if(this.loadTimeoutScheduler=s.loadTimeoutScheduler??qm,this.motionTimeoutMilliseconds=s.motionTimeoutMilliseconds??1e4,this.profileMotionTimeoutMilliseconds=s.profileMotionTimeoutMilliseconds??6e4,!Number.isSafeInteger(this.motionTimeoutMilliseconds)||this.motionTimeoutMilliseconds<=0)throw new RangeError("motion timeout must be a positive safe integer");if(!Number.isSafeInteger(this.profileMotionTimeoutMilliseconds)||this.profileMotionTimeoutMilliseconds<=0)throw new RangeError("profile motion timeout must be a positive safe integer");this.motionTimeoutScheduler=s.motionTimeoutScheduler??qm,this.backend.setMotionFaultHandler?.(o=>this.handleMotionFault(o)),this.backend.setMotionActiveHandler?.(o=>this.handleMotionActive(o))}sessionID;backend;scheduler;post;decoder;state="booting";presentation=Um();observationSequence=0;frameHandle=null;lastTimestamp=null;counters={frames:0,updates:0,renders:0};activeLoad=null;activeMotionLoad=null;backendReleased=!1;awaitingReconciliation=!1;activeProfile=null;activeProfileLoadSequence=null;latestPhaseCommandSequence=null;loadTimeoutMilliseconds;loadTimeoutScheduler;motionTimeoutMilliseconds;profileMotionTimeoutMilliseconds;motionTimeoutScheduler;avatarGeneration=0;discardedMotions=new WeakSet;failedMotionTokens=new Set;start(){this.observe(null,{type:"wrapper_ready",payload:{bridge_version:2}})}async accept(e){if(["failed","disposing","disposed"].includes(this.state))return;let t;try{t=this.decoder.decode(e)}catch(n){if(n instanceof bo){this.fail("bridge_invalid","configure",null);return}throw n}try{await this.execute(t.command,t.sequence)}catch{this.fail("render_failed",Ym(t.command),t.sequence)}}contextLost(){this.fail("context_lost","render",null)}snapshot(){return{state:this.state,presentation:{...this.presentation},counters:{...this.counters}}}async execute(e,t){if(e.type==="dispose"){this.dispose(e.payload.reason,t);return}if(!this.commandIsLegal(e)){this.fail("bridge_invalid",Ym(e),t);return}switch(e.type){case"configure":{let n={reducedMotion:e.payload.reduced_motion,mouthCuesEnabled:e.payload.mouth_cues_enabled};this.backend.configure(n),this.presentation=Eo(this.presentation,{type:"set_policy",payload:{reduced_motion:n.reducedMotion,mouth_cues_enabled:n.mouthCuesEnabled}}).state,this.state=Dn(this.state,{type:"configured"}).state,this.observe(t,{type:"renderer_ready",payload:{webgl:"webgl2"}});return}case"load_profile":await this.load(e.payload,t);return;case"set_visibility":this.visibility(e.payload.visibility,t);return;case"project_phase":case"set_policy":case"set_mouth":case"reset":this.applyPresentation(e,t);return;case"reconcile_presentation":if(!this.awaitingReconciliation){this.fail("bridge_invalid","resume",t);return}this.applyPresentation(e,t),this.awaitingReconciliation=!1;return}}async load(e,t){this.state=Dn(this.state,{type:"load_started"}).state,this.abortActiveMotionLoad();let n=++this.avatarGeneration;this.failedMotionTokens.clear(),this.activeProfile=e,this.activeProfileLoadSequence=t;let r=new AbortController;this.activeLoad=r;let s=null,o=!1;try{let a=new Promise((u,h)=>{s=this.loadTimeoutScheduler.request(()=>{o=!0,r.abort(),h(new bh)},this.loadTimeoutMilliseconds)}),l=await Promise.race([this.backend.loadModel(`miller-avatar-local://app/session/${this.sessionID}/${e.model_token}.vrm`,r.signal),a]);if(this.state!=="loading")return;this.observe(t,{type:"profile_model_loaded",payload:{profile_revision:e.profile_revision,model_token:e.model_token,capabilities:l.capabilities}});let c=this.backend.renderOnce();if(!this.advanceCounters(1,0,1,"render",t))return;this.state=Dn(this.state,{type:"first_frame"}).state,this.observe(t,{type:"first_frame",payload:{profile_revision:e.profile_revision,model_token:e.model_token,...c}}),this.emitInitialMotionStatuses(e,t),this.startMotionLoading(e,t,n),this.presentation.reducedMotion||this.schedule()}catch{this.state==="loading"&&this.fail(o?"asset_load_timeout":"asset_load_failed","load",t)}finally{s!==null&&this.loadTimeoutScheduler.cancel(s),this.activeLoad===r&&(this.activeLoad=null)}}visibility(e,t){if(e!=="visible"){this.awaitingReconciliation=!1,this.state==="live"&&(this.cancelFrame(),this.backend.stopClock(),this.backend.setSuspended?.(!0),this.state=Dn(this.state,{type:"suspend"}).state),this.state==="suspended"&&this.applyPresentationInput({type:"suspend",visibility:e}),this.observe(t,{type:"suspended",payload:{visibility:e,...this.counters}});return}this.applyPresentationInput({type:"resume"}),this.backend.setSuspended?.(!1),this.backend.startClock(),this.awaitingReconciliation=!0,this.state=Dn(this.state,{type:"resume"}).state,this.advanceCounters(1,this.presentation.reducedMotion?0:1,1,"resume",t)&&(this.presentation.reducedMotion||this.backend.update(0),this.backend.renderFrame(),this.observe(t,{type:"resumed",payload:{...this.counters}}),this.presentation.reducedMotion||this.schedule())}emitInitialMotionStatuses(e,t){for(let n of jn){let r=e.motion_bindings[n];r.status!=="ready"&&this.observe(t,{type:"motion_status",payload:{profile_revision:e.profile_revision,model_token:e.model_token,motion_token:null,role:n,status:r.status,motion_code:null}})}}startMotionLoading(e,t,n){let r=new AbortController;this.activeMotionLoad=r,this.loadMotions(e,t,n,r).catch(()=>{}).finally(()=>{this.activeMotionLoad===r&&(this.activeMotionLoad=null)})}async loadMotions(e,t,n,r){let s=new Map;for(let c of jn){let u=e.motion_bindings[c];if(u.status!=="ready"||u.token===null)continue;let h=s.get(u.token)??[];h.push(c),s.set(u.token,h)}let o={value:!1},a=this.motionTimeoutScheduler.request(()=>{o.value=!0,r.abort()},this.profileMotionTimeoutMilliseconds),l=c=>({sessionID:this.sessionID,generationID:String(n),profileRevision:e.profile_revision,motionToken:c,url:`miller-avatar-local://app/session/${this.sessionID}/${c}.vrma`,isCurrent:()=>this.isCurrentMotion(e,t,n,c)});try{let c=await Promise.all([...s.entries()].map(async([f])=>this.loadOneMotion(l(f),r.signal,o)));if(!this.isCurrentProfile(e,t,n)){for(let f of c)this.discardMotion(f.motion);return}let u=new Map(c.map(f=>[f.motionToken,f])),h=new Map;for(let f of jn){let g=e.motion_bindings[f];if(g.status!=="ready"||g.token===null)continue;let _=u.get(g.token);if(!_||_.status==="cancelled")return;_.status==="ready"&&_.motion!==void 0?(h.set(f,_.motion),this.observe(t,{type:"motion_status",payload:{profile_revision:e.profile_revision,model_token:e.model_token,motion_token:g.token,role:f,status:"ready",motion_code:null}})):this.observe(t,{type:"motion_status",payload:{profile_revision:e.profile_revision,model_token:e.model_token,motion_token:g.token,role:f,status:_.status,motion_code:_.code}})}if(!this.isCurrentProfile(e,t,n)){this.discardRegistry(h);return}this.backend.replaceMotions(h,{sessionID:this.sessionID,profileRevision:e.profile_revision,modelToken:e.model_token,generation:n});let d=this.presentation.lastProjectionSequence;d!==void 0&&this.backend.apply({type:"apply_projection",command:{type:"project_phase",payload:{projection_sequence:d,generation_id:this.presentation.generationID,phase:this.presentation.phase,playback_id:this.presentation.playbackID}}},this.latestPhaseCommandSequence??void 0)}finally{this.motionTimeoutScheduler.cancel(a)}}async loadOneMotion(e,t,n){if(t.aborted||!e.isCurrent?.())return{motionToken:e.motionToken,status:"cancelled",code:null};let r=new AbortController,s=()=>{},o=new Promise((u,h)=>{s=h}),a=()=>{r.abort(),s(n.value?new ct("motion_load_timeout","profile motion load timed out"):new ct("cancelled","profile motion load cancelled"))};t.addEventListener("abort",a,{once:!0});let l=null,c=!1;try{let u=new Promise((h,d)=>{l=this.motionTimeoutScheduler.request(()=>{c=!0,r.abort(),d(new ct("motion_load_timeout","motion load timed out"))},this.motionTimeoutMilliseconds)});try{let h=this.backend.loadMotion(e,r.signal);h.then(f=>{(c||t.aborted||!e.isCurrent?.())&&this.discardMotion(f)},()=>{});let d=await Promise.race([h,u,o]);return t.aborted||!e.isCurrent?.()?(this.discardMotion(d),{motionToken:e.motionToken,status:n.value?"timed_out":"cancelled",code:n.value?"motion_load_timeout":null}):d.motionToken!==e.motionToken?(this.discardMotion(d),{motionToken:e.motionToken,status:"load_failed",code:"motion_load_failed"}):{motionToken:e.motionToken,status:"ready",code:null,motion:d}}catch(h){if(!e.isCurrent?.())return{motionToken:e.motionToken,status:"cancelled",code:null};if(n.value||c)return{motionToken:e.motionToken,status:"timed_out",code:"motion_load_timeout"};if(t.aborted)return{motionToken:e.motionToken,status:"cancelled",code:null};let d=h instanceof ct?h.code:"motion_load_failed";return d==="cancelled"?{motionToken:e.motionToken,status:"cancelled",code:null}:d==="motion_load_timeout"?{motionToken:e.motionToken,status:"timed_out",code:d}:{motionToken:e.motionToken,status:"load_failed",code:"motion_load_failed"}}}finally{t.removeEventListener("abort",a),l!==null&&this.motionTimeoutScheduler.cancel(l)}}isCurrentProfile(e,t,n){return(this.state==="live"||this.state==="suspended")&&!this.backendReleased&&this.activeProfile===e&&this.activeProfileLoadSequence===t&&this.avatarGeneration===n}isCurrentMotion(e,t,n,r){return this.isCurrentProfile(e,t,n)}discardMotion(e){if(e&&!this.discardedMotions.has(e)){this.discardedMotions.add(e);try{this.backend.discardMotion?.(e)}catch{}}}discardRegistry(e){let t=new Set(e.values());for(let n of t)this.discardMotion(n)}applyPresentation(e,t){e.type==="project_phase"&&(this.latestPhaseCommandSequence=t);let n=this.presentation.reducedMotion,r=Eo(this.presentation,e);this.presentation=r.state;for(let s of r.effects)this.backend.apply(s,s.type==="reset"?void 0:t);if(this.state==="live"&&n!==this.presentation.reducedMotion)if(this.presentation.reducedMotion){if(this.cancelFrame(),!this.advanceCounters(1,1,1,"render",t))return;this.backend.update(0),this.backend.renderFrame()}else this.schedule()}applyPresentationInput(e){let t=Eo(this.presentation,e);this.presentation=t.state;for(let n of t.effects)this.backend.apply(n)}schedule(){this.frameHandle!==null||this.state!=="live"||this.presentation.reducedMotion||(this.frameHandle=this.scheduler.request(e=>{if(this.frameHandle=null,this.state==="live")try{if(!Number.isFinite(e))throw new RangeError("frame timestamp must be finite");let t=this.lastTimestamp===null?0:Math.min(.25,Math.max(0,(e-this.lastTimestamp)/1e3));if(this.lastTimestamp=e,!this.advanceCounters(1,1,1,"render",null))return;this.backend.update(t),this.backend.renderFrame(),this.schedule()}catch{this.fail("render_failed","render",null)}}))}cancelFrame(){this.frameHandle!==null&&this.scheduler.cancel(this.frameHandle),this.frameHandle=null,this.lastTimestamp=null}dispose(e,t){let n=Dn(this.state,{type:"dispose",reason:e});n.effect==="begin_disposal"&&(this.state=n.state,this.cancelFrame(),this.abortActiveLoad(),this.abortActiveMotionLoad(),this.terminatePresentation(),this.avatarGeneration+=1,this.activeProfile=null,this.activeProfileLoadSequence=null,this.releaseBackend(),this.state=Dn(this.state,{type:"disposed"}).state,this.observe(t,{type:"disposed",payload:{reason:e}}))}fail(e,t,n){if(["disposing","disposed","failed"].includes(this.state))return;this.cancelFrame(),this.abortActiveLoad(),this.abortActiveMotionLoad(),this.terminatePresentation(),this.avatarGeneration+=1,this.activeProfile=null,this.activeProfileLoadSequence=null,this.state=Dn(this.state,{type:"fail",code:e}).state,this.decoder.dispose(),this.observe(n,{type:"failed",payload:{code:e,operation:t}});let r=Dn(this.state,{type:"dispose",reason:"failure"});r.effect==="begin_disposal"&&(this.state=r.state),this.releaseBackend(),this.state==="disposing"&&(this.state=Dn(this.state,{type:"disposed"}).state,this.observe(n,{type:"disposed",payload:{reason:"failure"}}))}observe(e,t){if(t.type==="profile_model_loaded"||t.type==="first_frame"||t.type==="motion_status"){let n=this.activeProfile;if(n===null||t.type!=="motion_status"&&e!==this.activeProfileLoadSequence||t.type==="motion_status"&&t.payload.status!=="runtime_failed"&&e!==this.activeProfileLoadSequence||t.payload.profile_revision!==n.profile_revision||t.payload.model_token!==n.model_token)throw new Error("profile observation identity mismatch")}if(t.type==="motion_active"&&(this.activeProfile===null||e!==this.latestPhaseCommandSequence||t.payload.profile_revision!==this.activeProfile.profile_revision||t.payload.model_token!==this.activeProfile.model_token))throw new Error("phase observation causality mismatch");this.observationSequence+=1,this.post(JSON.stringify({schema:Yn.observationSchema,session_id:this.sessionID,sequence:this.observationSequence,caused_by_sequence:e,type:t.type,payload:t.payload}))}handleMotionActive(e){if(this.activeProfile===null||this.backendReleased||this.activeProfile.profile_revision!==e.profileRevision||this.activeProfile.model_token!==e.modelToken||this.avatarGeneration!==e.generation||e.motionToken!==null&&this.failedMotionTokens.has(e.motionToken)||e.causedBySequence===null)return;let t=e.causedBySequence;this.observe(t,{type:"motion_active",payload:{profile_revision:e.profileRevision,model_token:e.modelToken,motion_token:e.motionToken,role:e.role,mode:e.mode}})}handleMotionFault(e){let t=this.activeProfile;if(t===null||this.backendReleased||t.profile_revision!==e.profileRevision||t.model_token!==e.modelToken||this.avatarGeneration!==e.generation)return;let n=e.causedBySequence??this.activeProfileLoadSequence;this.failedMotionTokens.add(e.motionToken);for(let r of jn){let s=t.motion_bindings[r];s.status!=="ready"||s.token!==e.motionToken||this.observe(n,{type:"motion_status",payload:{profile_revision:e.profileRevision,model_token:e.modelToken,motion_token:e.motionToken,role:r,status:"runtime_failed",motion_code:"motion_runtime_failed"}})}}abortActiveLoad(){this.activeLoad?.abort()}abortActiveMotionLoad(){this.activeMotionLoad?.abort(),this.activeMotionLoad=null}terminatePresentation(){this.awaitingReconciliation=!1;let e=Eo(this.presentation,{type:"renderer_failed"});this.presentation=e.state;for(let t of e.effects)try{this.backend.apply(t)}catch{}}releaseBackend(){if(!this.backendReleased){this.backendReleased=!0;try{this.backend.stopClock()}catch{}try{this.backend.dispose()}catch{}}}advanceCounters(e,t,n,r,s){return this.counters.frames>Number.MAX_SAFE_INTEGER-e||this.counters.updates>Number.MAX_SAFE_INTEGER-t||this.counters.renders>Number.MAX_SAFE_INTEGER-n?(this.fail("resource_limit",r,s),!1):(this.counters.frames+=e,this.counters.updates+=t,this.counters.renders+=n,!0)}commandIsLegal(e){return this.awaitingReconciliation&&e.type!=="reconcile_presentation"?!1:e.type==="configure"?this.state==="booting":e.type==="load_profile"?this.state==="ready":e.type==="set_mouth"?this.state==="live":e.type==="reconcile_presentation"?this.awaitingReconciliation&&this.state==="live":e.type==="set_visibility"?e.payload.visibility==="visible"?this.state==="suspended":this.state==="live"||this.state==="suspended":["ready","loading","live","suspended"].includes(this.state)}},bh=class extends Error{},qm={request(i,e){return globalThis.setTimeout(i,e)},cancel(i){globalThis.clearTimeout(i)}};function Ym(i){return i.type==="configure"?"configure":i.type==="load_profile"?"load":i.type==="set_visibility"?i.payload.visibility==="visible"?"resume":"suspend":i.type==="set_policy"?"policy":i.type==="reconcile_presentation"?"resume":i.type==="dispose"?"dispose":"render"}var uS=/^\/session\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/bundle\/index\.html$/u;function jm(i){let e=new Hl(hS(i.entryURL),i.backend,i.scheduler,i.postObservation);return i.installReceiver({accept(t){return e.accept(t)}}),e.start(),e}function hS(i){let e=new URL(i),t=uS.exec(e.pathname);if(e.protocol!=="miller-avatar-local:"||e.hostname!=="app"||e.username!==""||e.password!==""||e.port!==""||e.search!==""||e.hash!==""||t===null||t[1]!==t[1]?.toLowerCase())throw new Error("invalid renderer entry URL");return t[1]}function Zm(){let i=globalThis.document.getElementById("avatar");if(!(i instanceof HTMLElement))throw new Error("missing renderer root");return jm({entryURL:globalThis.location.href,backend:new Fl(i),scheduler:pS,postObservation(e){let t=fS();if(!t)throw new Error("missing observation transport");t.postMessage(e)},installReceiver:dS})}function dS(i){if("millerAvatarBridge"in globalThis)throw new Error("bridge receiver already installed");Object.defineProperty(globalThis,"millerAvatarBridge",{value:Object.freeze(i),configurable:!1,enumerable:!1,writable:!1})}function fS(){return globalThis.webkit?.messageHandlers?.millerAvatarObservation}var pS={request(i){return globalThis.requestAnimationFrame(i)},cancel(i){globalThis.cancelAnimationFrame(i)}};var $m=class{disposed=!1;callbacks=[];recordedFailures=[];get failures(){return this.recordedFailures}add(e){if(this.disposed){this.run(e);return}this.callbacks.push(e)}dispose(){if(this.disposed)return[];this.disposed=!0;let e=[];for(let t of this.callbacks.splice(0).reverse()){let n=this.run(t);n!==void 0&&e.push(n)}return e}run(e){try{e();return}catch(t){return this.recordedFailures.push(t),t}}};Zm();export{bo as BridgeValidationError,$m as DisposalBag,kl as PresentationCommandDecoder,Bm as PresentationObservationDecoder,Fl as ThreeVRMRendererBackend,Hl as WebRendererCore,_m as applyMouthExpressionValues,jn as avatarMotionRoles,Yn as bridgeContract,Vb as collectAvatarEvidence,zb as collectMotionBounds,UR as collectRootMotionOffsets,kb as countAlphaPixels,Ub as detectMouthCapabilities,xh as disposalReasons,vh as disposeAvatarResources,mm as expandBoundsForOffsets,Dm as failureCodes,Nm as failureOperations,gm as fitCamera,Um as initialPresentationState,wR as maximumViewportDimension,AR as maximumViewportPixels,Cm as motionActiveModes,Am as motionBindingStatuses,Pm as motionFailureCodes,Rm as motionStatuses,Mh as mouthVowelKeys,Hb as observeRootResize,Ob as phasePresentationFor,yh as presentationPhases,Im as presentationVisibilities,Dn as reduceLifecycle,Eo as reducePresentation,Bb as requireSessionAssetURL,Nl as requireSessionMotionURL,Fb as requireVRM1,Lm as resetReasons,hS as sessionIDFromEntryURL,Gb as settleStaticRestPose,jm as startBrowserRenderer,Zm as startBrowserRuntime,Tm as steadyMotionRoles,wm as terminalMotionRoles};
