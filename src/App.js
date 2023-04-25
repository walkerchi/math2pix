import React from 'react'
import { useEffect, useState } from 'react';
import styles from './App.module.css';
import {remark} from 'remark'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import {toSvg, toPng, toJpeg, toBlob} from 'html-to-image'
import hightlight from 'remark-highlight.js'
import GithubIcon from './svg/Github';


import "katex/dist/katex.min.css";



function App() {
  const [tex, setTex] = useState('x^2');
  const [html, setHTML] = useState(null);
  const [imgType, setImgType] = useState('png');


  useEffect(()=>{

    console.log(tex)
    const processor = remark()
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeStringify)
    const result = processor.processSync("$$\n" + tex + "\n$$")
   
    setHTML(result.value)
    // update image

   
   
  },[tex,imgType])
  return (
    <div className={styles.container}>
      <h1>Math 2 Pix</h1>
      <div className={styles.body}>
        <textarea id="math" className={styles.math} 
          onChange={e=>{
          console.log(e.target.value)
          setTex(e.target.value)}}
          value={tex}
          >
        </textarea>
        <div id="image" className={styles.image}>
          <div id="math-image" className={styles["math-image"]} dangerouslySetInnerHTML={{__html:html}}></div>
          <select onChange={e=>setImgType(e.target.value)}>
            <option>png</option>
            <option>jpg</option>
            <option>svg</option>
          </select>
          <div className={styles.button}
            onClick={e=>{
              const ele = document.getElementById("math-image").firstChild
              // ele.style.overflow = "visible"
              const htmlToImage = {
                png:toPng,
                jpg:toJpeg,
                svg:toSvg
              }[imgType]
              htmlToImage(ele,{width:ele.scrollWidth, height:ele.scrollHeight + 20})
              .then((dataURL=>{
                console.log(dataURL)
                const link = document.createElement('a')
                link.download = `math.${imgType}`
                link.href = dataURL
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                // ele.style.overflow = "auto"
              }))
              .catch(function (error) {
                console.error('Unable to render image', error);
              });
             
            }}
          >Download</div>
          
        </div>
      </div>
      <a href="https://github.com/walkerchi/math2pix" className={styles.github}>
        <GithubIcon/>
      </a>
    </div>
  );
}

export default App;
