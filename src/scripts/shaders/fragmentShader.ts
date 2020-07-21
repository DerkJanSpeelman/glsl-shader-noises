export const fragmentShader: string = /* glsl */ `
    #define M_PI radians(180.0)

    struct FuncData
    {
        int id;
        bool alive;
    };

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_functions_length;
    uniform FuncData u_functions[6];

    const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );

    float rand(vec2 n) {
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    // Permute vec3
    vec3 permute(vec3 x)
    {
        return mod(((x * 34.0) + 1.0) * x, 289.0);
    }
    // Permute vec4
    vec4 permute4(vec4 x)
    {
        return mod(((x * 34.0) + 1.0) * x, 289.0);
    }

    // Hash vec2 method
    float hash(vec2 p)
    {
        p  = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
        return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));
    }

    // Fade method
    vec2 fade(vec2 t) {
        return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    }

    // Basic random noise
    float random_noise( vec2 p )
    {
        vec2 r = vec2(
            exp(M_PI), // e^pi (Gelfonds constant)
            pow(2.0, sqrt(2.0)) // 2^sqrt(2) (Gelfond-Schneider constant)
        );
        return fract( cos( mod( 12345678., 256. * dot(p,r) ) ) );
    }

    // Simplex vec2 noise
    float simplex_noise(vec2 v)
    {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 2.0 * 130.0 * dot(m, g);
    }

    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float simplexNoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //  x0 = x0 - 0. + 0.0 * C
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0 );
    vec4 p = permute4( permute4( permute4(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients
    // ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    // Value vec2 noise
    float value_noise(in vec2 p)
    {
        vec2 i = floor( p );
        vec2 f = fract( p );

        vec2 u = f * f *(3.0 - 2.0 * f);

        return mix(mix(hash(i + vec2(0.0, 0.0)),
                       hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)),
                       hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    // Perlin noise
    float perlin_noise(vec2 P)
    {
        vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
        vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
        Pi = mod(Pi, 289.0);
        vec4 ix = Pi.xzxz;
        vec4 iy = Pi.yyww;
        vec4 fx = Pf.xzxz;
        vec4 fy = Pf.yyww;
        vec4 i = permute4(permute4(ix) + iy);
        vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
        vec4 gy = abs(gx) - 0.5;
        vec4 tx = floor(gx + 0.5);
        gx = gx - tx;
        vec2 g00 = vec2(gx.x,gy.x);
        vec2 g10 = vec2(gx.y,gy.y);
        vec2 g01 = vec2(gx.z,gy.z);
        vec2 g11 = vec2(gx.w,gy.w);
        vec4 norm = 1.79284291400159 - 0.85373472095314 *
            vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
        g00 *= norm.x;
        g01 *= norm.y;
        g10 *= norm.z;
        g11 *= norm.w;
        float n00 = dot(g00, vec2(fx.x, fy.x));
        float n10 = dot(g10, vec2(fx.y, fy.y));
        float n01 = dot(g01, vec2(fx.z, fy.z));
        float n11 = dot(g11, vec2(fx.w, fy.w));
        vec2 fade_xy = fade(Pf.xy);
        vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
        float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
        return 2.3 * n_xy;
    }

    vec3 hash3( vec2 p )
    {
        vec3 q = vec3( dot(p,vec2(127.1,311.7)),
                    dot(p,vec2(269.5,183.3)),
                    dot(p,vec2(419.2,371.9)) );
        return fract(sin(q)*43758.5453);
    }
    float voronoise( in vec2 x, float u, float v )
    {
        vec2 p = floor(x);
        vec2 f = fract(x);

        float k = 1.0+63.0*pow(1.0-v,6.0);

        float va = 0.0;
        float wt = 0.0;
        for( int j=-2; j<=2; j++ )
        for( int i=-2; i<=2; i++ )
        {
            vec2 g = vec2( float(i),float(j) );
            vec3 o = hash3( p + g )*vec3(u,u,1.0);
            vec2 r = g - f + o.xy;
            float d = dot(r,r);
            float ww = pow( 1.0-smoothstep(0.0,1.414,sqrt(d)), k );
            va += o.z*ww;
            wt += ww;
        }

        return va/wt;
    }

    float fbm_noise(vec2 p){
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u*u*(3.0-2.0*u);

        float res = mix(
            mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
            mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
        return res*res;
    }
    float fbm( vec2 p )
    {
        float f = 0.0;

        f += 0.500000*fbm_noise( p + u_time  ); p = mtx*p*2.02;
        f += 0.031250*fbm_noise( p ); p = mtx*p*2.01;
        f += 0.250000*fbm_noise( p ); p = mtx*p*2.03;
        f += 0.125000*fbm_noise( p ); p = mtx*p*2.01;
        f += 0.062500*fbm_noise( p ); p = mtx*p*2.04;
        f += 0.015625*fbm_noise( p + sin(u_time) );

        return f/0.96875;
    }
    float pattern( in vec2 p )
    {
        return fbm( p + fbm( p ) );
    }
    float colormap_red(float x) {
    if (x < 0.0) {
        return 54.0 / 255.0;
    } else if (x < 20049.0 / 82979.0) {
        return (829.79 * x + 54.51) / 255.0;
    } else {
        return 1.0;
    }
}

float colormap_green(float x) {
    if (x < 20049.0 / 82979.0) {
        return 0.0;
    } else if (x < 327013.0 / 810990.0) {
        return (8546482679670.0 / 10875673217.0 * x - 2064961390770.0 / 10875673217.0) / 255.0;
    } else if (x <= 1.0) {
        return (103806720.0 / 483977.0 * x + 19607415.0 / 483977.0) / 255.0;
    } else {
        return 1.0;
    }
}

float colormap_blue(float x) {
    if (x < 0.0) {
        return 54.0 / 255.0;
    } else if (x < 7249.0 / 82979.0) {
        return (829.79 * x + 54.51) / 255.0;
    } else if (x < 20049.0 / 82979.0) {
        return 127.0 / 255.0;
    } else if (x < 327013.0 / 810990.0) {
        return (792.02249341361393720147485376583 * x - 64.364790735602331034989206222672) / 255.0;
    } else {
        return 1.0;
    }
}

vec4 colormap(float x) {
    return vec4(colormap_red(x), colormap_green(x), colormap_blue(x), 1.0);
}

    // Special functions
    mat2 rotate2d(float angle){
        return mat2(cos(angle), -sin(angle),
                    sin(angle), cos(angle));
    }
    float lines(in vec2 pos, float b, float s){
        pos *= s;
        return smoothstep(0.0,
                        .5+b*.5,
                        abs((sin(pos.x*3.1415)+b*2.0))*.5);
    }

    void main()
    {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
        vec2 uv2 = gl_FragCoord.xy / u_resolution.xx;

        vec2 noiseuv = uv;
        noiseuv.x += cos(u_time) - .5;
        noiseuv.y += sin(u_time) - .5;

        float scale = 4.0 * cos(u_time);
        float noise = 0.0;

        for (int i = 0; i <= u_functions.length(); i++)
        {
            FuncData f = u_functions[i];

            if (f.alive)
            {
                if (f.id == 0)
                {
                    noise += random_noise(noiseuv * scale);
                }
                if (f.id == 1)
                {
                    noise += simplex_noise(noiseuv * scale);
                }
                if (f.id == 2)
                {
                    noise += perlin_noise(noiseuv * scale);
                    // mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
                    // noise += 0.5000 * perlin_noise( noiseuv * 10.0 ); noiseuv = m * noiseuv;
                    // noise += 0.2500 * perlin_noise( noiseuv ); noiseuv = m * noiseuv;
                    // noise += 0.1250 * perlin_noise( noiseuv ); noiseuv = m * noiseuv;
                }
                if (f.id == 3)
                {
                    noise += value_noise(noiseuv * scale);
                    // mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
                    // noise += 0.5000 * value_noise( noiseuv * 10.0 ); noiseuv = m * noiseuv;
                    // noise += 0.2500 * value_noise( noiseuv ); noiseuv = m * noiseuv;
                    // noise += 0.1250 * value_noise( noiseuv ); noiseuv = m * noiseuv;
                }
                if (f.id == 4)
                {
                    noise += voronoise( 5.0 * scale * noiseuv, 1.0, 0.0 );
                    noise = clamp(noise, 0.0, 1.0) * 2.0 - 1.0;
                }
                if (f.id == 5)
                {
                    noise += pattern(noiseuv);
                }
            }
        }

        // // clamp all noise values between -1.0 en 1.0
        noise = clamp(noise, -1.0, 1.0);

        // // // Create color
        // // vec3 color = vec3(noise, noise, noise);
        // vec3 color1 = vec3(1.0,0.55,0);
        // vec3 color2 = vec3(0.226,0.000,0.615);
        // vec3 color = mix(color1, color2, noise);

        // // // Draw the color
        // gl_FragColor = vec4(color, 0.0);

        gl_FragColor = vec4(colormap(noise).rgb, noise);


        // vec2 st = gl_FragCoord.xy/u_resolution.xy;
        // st.y *= u_resolution.y/u_resolution.x;
        // vec2 pos = st.yx*vec2(10.,3.);
        // float pattern = pos.x;
        // // Add noise
        // pos = rotate2d( noise ) * pos / 10.0;
        // // Draw lines
        // pattern = lines(pos, -0.5, 10.0);
        // vec3 color = vec3(pattern);
        // // color += smoothstep(.15,.2,noise); // Black splatter
        // // color -= smoothstep(.35,.4,noise); // Holes on splatter
        // gl_FragColor = vec4(color,1.0);

        // vec2 st = gl_FragCoord.xy/u_resolution.xy;
        // st.x *= u_resolution.x/u_resolution.y;
        // vec3 color = vec3(0.0);

        // float t = 1.0;
        // // Uncomment to animate
        // t = abs(1.0-sin(u_time*.1))*5.;
        // // Comment and uncomment the following lines:
        // st += perlin_noise(st*2.)*t; // Animate the coordinate space
        // color = vec3(1.) * smoothstep(.18,.2,perlin_noise(st)); // Big black drops
        // color += smoothstep(.15,.2,perlin_noise(st*10.)); // Black splatter
        // color -= 2.0 * smoothstep(-1.0,.4,perlin_noise(st*10.)); // Holes on splatter

        // gl_FragColor = vec4(1.0 - color, 1.0);

        // vec3 color1 = vec3(1.0,0.55,0);
        // vec3 color2 = vec3(0.226,0.000,0.615);
        // vec3 color = mix(color1, color2, noise);
        // vec3 color = vec3(noise, noise, noise);

        // if (noise > 1.0) {
        //     color = vec3(0.0,1.0,0.0);
        // }
        // if (noise < -1.0) {
        //     color = vec3(1.0,0.0,0.0);
        // }

        // gl_FragColor = vec4(color, 0.0);
    }
`;
