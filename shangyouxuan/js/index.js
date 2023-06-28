//作用：需要将所有的DOM元素对象以及相关的资源全部都加载完毕之后，再来实现的事件函数
window.onload = function () {

    //声明一个记录点击的缩略图下标
    let bigimgIndex = 0;

    navPathDataBind();
    bigClassBind();
    thumbnailData();
    thumbnailClick();
    thumbnailLeftRightClick();
    rightTopData();
    rightBottomData();

    // 路径导航的数据渲染
    function navPathDataBind() {
        /**
     * 思路：
     * 1、先获取路径导航的页面元素（navPath）
     * 2、再来获取所需要的数据（data.js->goodData.path）
     * 3、由于数据是需要动态产生的，那么相应的DOM元素也应该是动态产生的，含义需要根据数据的数量来进行创建DOM元素
     * 4、在遍历数据创建DOM元素的最后一条，只创建a标签，而不创建i标签
     */

        //1.获取页面导航的元素对象
        let navPath = document.querySelector('#wrapper #content .contentMain #navPath');

        //2.获取数据
        let path = goodData.path;

        //3.遍历数据
        for (let i = 0; i < path.length; i++) {
            if (i == path.length - 1) {
                //只需要创建a且没有href属性
                const aNode = document.createElement("a");
                aNode.innerText = path[i].title;
                navPath.appendChild(aNode);
            } else {
                //4.创建a标签
                const aNode = document.createElement("a");
                aNode.href = path[i].url;
                aNode.innerText = path[i].title;

                //5.创建i标签
                const iNode = document.createElement('i');
                iNode.innerText = '/';

                //6.让navPath元素来追加a和i
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }
        }
    }

    // 放大镜的移入、移出效果
    function bigClassBind() {
        /**
         * 思路：
         * 1、获取小图框元素对象，并且设置移入事件(onmouseenter)
         * 2、动态的创建蒙版元素以及大图框和大图片元素
         * 3、移出时(onmouseleave)需要移除蒙版元素和大图框
         */

        //1.获取小图框元素
        const smallPic = document.querySelector("#wrapper #content .contentMain #center #left #leftTop #smallPic")
        //获取leftTop元素
        const leftTop = document.querySelector('#wrapper #content .contentMain #center #left #leftTop');

        //获取数据
        const imagessrc = goodData.imagessrc;

        //2.设置移入事件
        smallPic.addEventListener("mouseenter", function () {
            //3. 创建蒙版元素
            const maskDiv = document.createElement('div');
            maskDiv.className = "mask";

            //4.创建大图框元素
            const BigPic = document.createElement('div');
            BigPic.id = "bigPic";

            //5.创建大图片元素
            const BigImg = document.createElement('img');
            BigImg.src = imagessrc[bigimgIndex].b;

            //6.大图框来追加大图片
            BigPic.appendChild(BigImg);

            //7.让小图框来追加蒙版元素
            smallPic.appendChild(maskDiv);

            //8.让leftTop元素追加大图框
            leftTop.appendChild(BigPic);

            //设置移动事件
            smallPic.onmousemove = function (event) {
                //event.clientX: 鼠标点距离浏览器左侧X轴的值
                //getBoundingClientRect().left:小图框元素距离浏览器左侧可视left值
                //offsetWidth:为元素的占位宽度
                let left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
                let top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;

                //判断
                if (left < 0) {
                    left = 0;
                } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
                    left = smallPic.clientWidth - maskDiv.offsetWidth;
                }

                if (top < 0) {
                    top = 0;
                } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
                    top = smallPic.clientHeight - maskDiv.offsetHeight;
                }

                //设置left和top属性
                maskDiv.style.left = left + "px";
                maskDiv.style.top = top + "px";

                //移动的比例关系 = 蒙版元素移动的距离  /  大图片元素移动的距离
                //蒙版元素移动的距离 = 小图框宽度 – 蒙版元素的宽度
                //大图片元素移动的距离 = 大图片宽度 – 大图框元素的宽度

                const scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (BigImg.offsetWidth - BigPic.clientWidth);

                BigImg.style.left = -left / scale + "px";
                BigImg.style.top = -top / scale + "px";
            }

            //设置移出事件
            smallPic.onmouseleave = function () {

                //让小图框移除蒙版元素
                smallPic.removeChild(maskDiv);

                //让leftTop元素移除大图框
                leftTop.removeChild(BigPic);
            }
        })
    }

    // 动态渲染放大镜缩略图的数据
    function thumbnailData() {
        /**
         * 思路：
         * 1、先获取piclist元素下的ul
         * 2、在获取data.js文件下的goodData->imagessrc
         * 3、遍历数组，根据数组的长度来创建li元素
         * 4、让ul遍历追加li元素
         */

        //1.获取piclist下的ul
        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul');

        //2.获取imagessrc数据
        var imagessrc = goodData.imagessrc;

        //3.遍历数组
        for (let i = 0; i < imagessrc.length; i++) {
            //4.创建li元素
            const newLi = document.createElement('li');

            //5.创建img元素
            const newImg = document.createElement('img');
            newImg.src = imagessrc[i].s;

            //6.让li追加img元素
            newLi.appendChild(newImg);

            //7.让ul追加li元素
            ul.appendChild(newLi);
        }
    }

    //点击缩略图的效果
    function thumbnailClick() {
        /**
         * 思路：
         * 1、获取所有的li元素，并且循环发生点击事件
         * 2、点击缩略图需要确定其下标位置来找到对应小图路径和大图路径替换现有src的值
         */

        //1.获取所有的li元素
        const liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');

        const smallPic_img = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic img');

        const imagessrc = goodData.imagessrc;

        //小图路径需要默认和imagessrc的第一个元素小图的路径是一致的
        smallPic_img.src = imagessrc[0].s;

        //2.循环点击这些li元素
        for (let i = 0; i < liNodes.length; i++) {
            //在点击事件之前，给每一个元素都添加上自定义的下标
            liNodes[i].index = i; /** 还可以通过setAttribute('index',i) */
            liNodes[i].onclick = function () {
                let idx = this.index; /** 事件函数中的this永远指向的是实际发生事件的目标源对象 */
                bigimgIndex = idx;

                //变换小图路径
                smallPic_img.src = imagessrc[idx].s;
            }
        }
    }

    //点击缩略图左右箭头的效果
    function thumbnailLeftRightClick() {
        /**
         * 思路：
         * 1、先获取左右两端的箭头按钮
         * 2、在获取可视的div以及ul元素和所有的li元素
         * 3、计算（发生起点、步长、总体运动的距离值）
         * 4、然后再发生点击事件
         */

        //1、获取箭头元素
        const prev = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.prev');
        const next = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.next');

        //2、获取可视的div以及ul元素和所有的li元素
        const ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul');

        const liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');

        //3、计算

        //发生起点
        let start = 0;

        //步长
        let step = (liNodes[0].offsetWidth + 20) * 2;

        //总体运动的距离值 = ul的宽度 - div框的宽度 = (图片的总数 - div中显示的数量) * （li的宽度 + 20）
        let endPostion = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20);

        //4、发生事件
        prev.onclick = function () {
            start -= step;
            if (start < 0) {
                start = 0;
            }
            ul.style.left = -start + "px";
        }

        next.onclick = function () {
            start += step;
            if (start > endPostion) {
                start = endPostion;
            }
            ul.style.left = -start + "px";
        }

    }

    //商品详情数据的动态渲染
    function rightTopData() {
        /**
         * 思路：
         * 1、查找rightTop元素
         * 2、查找data.js->goodData->goodsDetail
         * 3、建立一个字符串变量，将原来的布局结构贴进来，将所对应的数据放在对应的位置上重新渲染rightTop元素
         */

        //1、查找元素
        const rightTop = document.querySelector('#wrapper #content .contentMain #center .right .rightTop');

        //2、查找数据
        const goodsDetail = goodData.goodsDetail;

        //3、创建一个字符串(双引号、单引号、模板字符串)变量
        //模板字符串替换数据：${变量}
        const s = `<h3>${goodsDetail.title}</h3>
                <p>${goodsDetail.recommend}</p>
                <div class="priceWrap">
                    <div class="priceTop">
                        <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                        <div class="price">
                            <span>￥</span>
                            <p>${goodsDetail.price}</p>
                            <i>降价通知</i>
                        </div>
                        <p>
                            <span>累计评价</span>
                            <span>${goodsDetail.evaluateNum}</span>
                        </p>
                    </div>
                    <div class="priceBottom">
                        <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                        <p>
                            <span>${goodsDetail.promoteSales.type}</span>
                            <span>${goodsDetail.promoteSales.content}</span>
                        </p>
                    </div>
                </div>
                <div class="support">
                    <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                    <p>${goodsDetail.support}</p>
                </div>
                <div class="address">
                    <span>配&nbsp;送&nbsp;至</span>
                    <p>${goodsDetail.address}</p>
                </div>`;

        //4、重新渲染rightTop元素
        rightTop.innerHTML = s;
    }

    //商品参数数据的动态渲染
    function rightBottomData() {
        /**
         * 思路：
         * 1、找rightBottom的元素对象
         * 2、查找data.js->goodData.goodsDetail.crumbData数据
         * 3、由于数据是一个数组，需要遍历，有一个元素则需要有一个动态的dl元素对象(dt、dd)
         */

        //1、查找元素对象
        const chooseWrap = document.querySelector('#wrapper #content .contentMain #center .right .rightBottom .chooseWrap');

        //2、查找数据
        const crumbData = goodData.goodsDetail.crumbData;

        //3、循环数据
        for (let i = 0; i < crumbData.length; i++) {

            //4、创建dl元素对象
            const dlNode = document.createElement('dl');

            //5、创建dt元素对象
            const dtNode = document.createElement('dt');
            dtNode.innerText = crumbData[i].title;

            //6、dl追加dt
            dlNode.appendChild(dtNode);

            //7、遍历crumbData->data元素
            for (let j = 0; j < crumbData[i].data.length; j++) {

                //创建dd元素
                const ddNode = document.createElement('dd');
                ddNode.innerText = crumbData[i].data[j].type;

                //让dl来追加dd
                dlNode.appendChild(ddNode);
            }

            //8、让chooseWrap追加dl
            chooseWrap.appendChild(dlNode);
        }
    }
}