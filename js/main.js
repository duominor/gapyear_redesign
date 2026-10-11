
// FLOW GALLERY - 스와이프

const flowGallery = document.querySelector(".flow_gallery");
const flowTrack = document.querySelector(".flow_gallery_track");
const flowGroup = document.querySelector(".flow_gallery_group");

if (flowGallery && flowTrack && flowGroup) {

    let position = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let lastTime = 0;
    let activePointerId = null;

    // 기존 CSS 70초 속도 유지
    const duration = 70;

    function getGroupWidth() {
        return flowGroup.getBoundingClientRect().width;
    }

    function normalizePosition(groupWidth) {
        position = ((position % groupWidth) + groupWidth) % groupWidth;
    }

    // 자동 이동
    function animate(time) {

        if (!lastTime) lastTime = time;

        const deltaTime = Math.min(time - lastTime, 100);
        lastTime = time;

        const groupWidth = getGroupWidth();

        if (groupWidth > 0) {

            if (!isDragging) {
                position += (groupWidth / (duration * 1000)) * deltaTime;
            }

            normalizePosition(groupWidth);

            flowTrack.style.transform =
                `translate3d(${-position}px, 0, 0)`;
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);


    flowGallery.querySelectorAll("img").forEach(img => {
        img.draggable = false;
    });

    // 드래그 시작
    flowGallery.addEventListener("pointerdown", function(e) {

        if (e.pointerType === "mouse" && e.button !== 0) return;

        isDragging = true;
        activePointerId = e.pointerId;
        lastPointerX = e.clientX;

        flowGallery.setPointerCapture(e.pointerId);
    });

    // 드래그 이동
    flowGallery.addEventListener("pointermove", function(e) {

        if (!isDragging || e.pointerId !== activePointerId) return;

        const moveX = e.clientX - lastPointerX;

        // 손가락이나 마우스 움직임만큼 이동
        position -= moveX;

        lastPointerX = e.clientX;
    });

    // 드래그 종료
    function stopDragging(e) {

        if (e.pointerId !== activePointerId) return;

        isDragging = false;
        activePointerId = null;
    }

    flowGallery.addEventListener("pointerup", stopDragging);
    flowGallery.addEventListener("pointercancel", stopDragging);
    flowGallery.addEventListener("lostpointercapture", stopDragging);
}





// 카드플립


const experienceCards = document.querySelectorAll(".experience_card");

experienceCards.forEach(function(card){

    card.addEventListener("mouseenter", function(){

        experienceCards.forEach(function(otherCard){
            otherCard.classList.remove("active");
        });

        card.classList.add("active");

    });

});



// MAP


const mapPinArea = document.querySelector(".map_pin_area");
const worldMap = document.querySelector(".world_map");
const regionMap = document.querySelector(".region_map");
const regionMapImg = document.querySelector(".region_map_img");
const mapTabs = document.querySelectorAll(".map_tab_btn");
const countryCard = document.querySelector(".country_card");
const countryGuide = document.querySelector(".country_guide");


// 대륙별 지도 이미지
const regionMapSources = {
    europe: "./img/europe_map.svg",
    asia: "./img/asia_map_1.svg",
    north_america: "./img/n_america_map.svg",
    south_america: "./img/s_america_map.svg",
    oceania: "./img/oceania_map.svg",
    africa: "./img/africa_map.svg"
};

// 대륙별 지도 이미지 - 1200px 이하
const regionMapMobileSources = {
    europe: "./img/europe_map_mobile.svg",
    asia: "./img/asia_map_1_mobile.svg",
    north_america: "./img/n_america_map_mobile.svg",
    south_america: "./img/s_america_map_mobile.svg",
    oceania: "./img/oceania_map_mobile.svg",
    africa: "./img/africa_map_mobile.svg"
};


// 대륙 선택


function selectRegion(regionId){

        const mobileCountrySelect =
        document.querySelector(".mobile_country_select");

    // 모든 탭 active 제거
    mapTabs.forEach(function(tab){
        tab.classList.remove("active");
    });

    // 선택한 탭 active
    const activeTab = document.querySelector(
        `.map_tab_btn[data-region="${regionId}"]`
    );

    if(activeTab){
        activeTab.classList.add("active");
    }


    // 기존 국가카드 숨김
    countryCard.style.display = "none";

    // 기존 프로젝트 상세카드 닫기
     document
    .querySelector(".project_detail_card")
    .classList.remove("active");


    // 전체
    if(regionId === "all"){


    // 모바일 안내 영역 표시
    mobileCountrySelect.classList.add("active");

   

    document.querySelector(".mobile_country_title").textContent =
    "어디로 떠나볼까요?";

    // ⭐ 전체 선택 시 안내 문구 변경 (추가)
    document.querySelector(".mobile_country_desc").textContent =
    "대륙을 선택하면 프로젝트 정보를 확인할 수 있어요.";

     // 이전 대륙의 국가 태그 삭제 ⭐
    document.querySelector(".mobile_country_list").innerHTML = "";


    worldMap.style.display = "block";
    regionMap.style.display = "none";

    countryCard.style.display = "none";
    countryGuide.style.display = "block";


   // 전체지도 대륙 핀 표시
    renderContinentPins();



    // 전체지도 안내문으로 복귀
    countryGuide.querySelector("h3").innerHTML =
        "어디에서 시작해볼까요?";

    countryGuide.querySelector("p").innerHTML =
        "대륙을 선택하면 지역별 갭이어 프로젝트를<br> 확인할 수 있어요.";

    return;


    }


    document.querySelector(".mobile_country_desc").textContent =
    "국가를 선택하면 프로젝트 정보를 확인할 수 있어요.";

    mobileCountrySelect.classList.add("active");

    mobileCountrySelect.style.display =
    window.innerWidth <= 1200 ? "block" : "none";

    // 대륙 선택 시 국가 태그 다시 표시
    document.querySelector(".mobile_country_list").style.display = "";

    // 대륙
    worldMap.style.display = "none";
    regionMap.style.display = "block";

    regionMapImg.src = window.innerWidth <= 1200
    ? regionMapMobileSources[regionId]
    : regionMapSources[regionId];

    countryGuide.querySelector("h3").innerHTML =
      "궁금한 국가를 선택해보세요.";

    countryGuide.querySelector("p").innerHTML =
      "지도 위 핀을 클릭하면 해당 국가의 프로젝트를<br> 확인할 수 있어요.";



    // 현재 선택한 대륙의 국가 핀 생성
    renderCountryPins(regionId);

}


// 전체지도 대륙 핀 데이터


const continentPins = [
    { region: "europe", name: "유럽", left: "51%", top: "29%" },
    { region: "asia", name: "아시아", left: "70%", top: "40%" },
    { region: "north_america", name: "북아메리카", left: "18%", top: "35%" },
    { region: "south_america", name: "남아메리카", left: "30%", top: "70%" },
    { region: "oceania", name: "오세아니아", left: "87%", top: "81%" },
    { region: "africa", name: "아프리카", left: "53%", top: "57%" }
];



// 전체지도 대륙 핀 생성


function renderContinentPins(){

    mapPinArea.innerHTML = "";

    continentPins.forEach(function(continent){

        const pin = document.createElement("button");

        pin.classList.add("map_pin", "continent_pin");

        pin.style.left = continent.left;
        pin.style.top = continent.top;

        pin.innerHTML = `
            <img src="./img/map_pin_icon.svg" alt="">
            <span>${continent.name}</span>
        `;

        pin.addEventListener("click", function(){
            selectRegion(continent.region);
        });

        mapPinArea.appendChild(pin);
    });
}



// 탭 클릭


mapTabs.forEach(function(tab){

    tab.addEventListener("click", function(){

        const regionId = tab.dataset.region;

        selectRegion(regionId);

    });

});

selectRegion("all");



let mapData = null;


fetch("./data/map.json")

    .then(function(response){
        return response.json();
    })

    .then(function(data){

        mapData = data;

        // 처음 화면 = 전체
        selectRegion("all");

    });



// 프로젝트 상세 표시


function showProject(projects, type) {

    const project = projects.find(function (item) {
        return item.type === type;
    });

    if (!project) {
        return;
    }

    document.querySelector(".project_detail_number").textContent =
        `PROJECT ${project.number}. ${project.type}`;

    document.querySelector(".project_detail_title").textContent =
        project.title;

    document.querySelector(".project_detail_desc").textContent =
        project.desc;

    document.querySelector(".project_detail_info p:nth-child(1) span").textContent =
        project.city;

    document.querySelector(".project_detail_info p:nth-child(2) span").textContent =
        project.period;

    document.querySelector(".project_detail_img img").src =
        project.image;

    document.querySelector(".project_detail_link").href =
        project.link;
}




// 국가 핀 생성


function renderCountryPins(regionId){

    // 기존 핀 삭제
    mapPinArea.innerHTML = "";


    // 선택한 대륙 찾기
    const selectedRegion = mapData.regions.find(function(region){
        return region.region === regionId;
    });

   console.log("선택 대륙:", selectedRegion);


    if(!selectedRegion){
        return;
    }


    renderMobileCountryList(selectedRegion);


    // 선택한 대륙의 국가 핀 생성
    selectedRegion.countries.forEach(function(country){

        if(
            country.position.left === "" ||
            country.position.top === ""
        ){
            return;
        }


        const pin = document.createElement("button");

        pin.classList.add("map_pin");


        // 주요 국가
        if(country.featured === true){
            pin.classList.add("featured");
        }


        // 라벨 위치 예외
        if(country.country === "네덜란드"){
            pin.classList.add("label_top");
        }




        if(country.country === "덴마크"){
            pin.classList.add("label_right");
        }


      if(country.country === "케냐"){
            pin.classList.add("label_right");
        }


       
      if(country.country === "보츠와나"){
            pin.classList.add("label_right");
        }
  

      if(country.country === "베트남"){
            pin.classList.add("label_right");
        }  


      if(country.country === "라오스"){
            pin.classList.add("label_right");
        }  


      
      if(country.country === "말레이시아"){
            pin.classList.add("label_left");
        }    
   


        // 핀 위치
        pin.style.left = country.position.left;
        pin.style.top = country.position.top;


        // 핀 내용
        pin.innerHTML = `
            <img src="./img/map_pin_icon.svg" alt="">
            <span>${country.country}</span>
        `;



        // 국가 핀 클릭


        pin.addEventListener("click", function(){


        document
        .querySelector(".project_detail_card")
        .classList.remove("active");


            // 모든 핀 선택 상태 해제
            document.querySelectorAll(".map_pin").forEach(function(otherPin){
                otherPin.classList.remove("active");
            });


            // 지금 클릭한 핀만 선택 상태
            pin.classList.add("active");


            // 안내 숨김
            countryGuide.style.display = "none";


            // 국가 카드 등장
            countryCard.style.display = "block";


            // 국가명
            document.querySelector(".country_name").textContent
                = country.country;


            // 영문 국가명
            document.querySelector(".country_name_en").textContent
                = country.countryEn;


            // 도시
            document.querySelector(".country_city_name").textContent
                = country.card.cities.join(" · ");



            document.querySelector(".country_card_img img").src =
                country.card.image;
   
            document.querySelector(".project_detail_all a").href =
                country.projectListLink || "#";

            document.querySelector(".project_detail_country").textContent =
                `${country.countryEn.toUpperCase()} · ${country.country}`;    


            // 프로젝트 태그
            const projectTagBox =
                document.querySelector(".project_tag_box");

            projectTagBox.innerHTML = "";

            // 상세카드 프로젝트 필터
    const projectFilterBox =
        document.querySelector(".project_filter_box");

    projectFilterBox.innerHTML = "";

    country.card.projectTypes.forEach(function(type){

    const filter = document.createElement("button");

    filter.classList.add("project_filter");
    filter.dataset.type = type;
    filter.textContent = type;

    filter.addEventListener("click", function(){

        // 모든 필터 active 해제
        document
            .querySelectorAll(".project_filter")
            .forEach(function(otherFilter){
                otherFilter.classList.remove("active");
            });

        // 클릭한 필터 active
        filter.classList.add("active");

        // 해당 프로젝트 표시
        showProject(
            country.projects,
            type
        );

    });

    projectFilterBox.appendChild(filter);

});

            country.card.projectTypes.forEach(function(type){

                const tag = document.createElement("div");

                tag.classList.add(
                    "project_tag",
                    "text_14"
                );

                tag.textContent = type;

     // 국가카드 태그 클릭
    tag.addEventListener("click", function(){

        if (!country.projects) {
            return;
        }

        // 상세 프로젝트 카드 열기
        document
    .querySelector(".project_detail_card")
    .classList.add("active");

        // 클릭한 태그의 프로젝트 표시
        showProject(
            country.projects,
            type
        );

        // 상세카드 필터 active 맞추기
        document.querySelectorAll(".project_filter").forEach(function(filter){

            filter.classList.toggle(
                "active",
                filter.dataset.type === type
            );

        });

    });

                projectTagBox.appendChild(tag);

            });


            // 링크
            document.querySelector(".country_link_but").href
                = country.card.link || "#";

        });


        mapPinArea.appendChild(pin);

    });

}



// 모바일 국가 버튼 생성


function renderMobileCountryList(region){


    const mobileCountryList =
        document.querySelector(".mobile_country_list");

    const mobileCountryTitle =
        document.querySelector(".mobile_country_title");

    if(!region){
        return;
    }

 
        

    // 대륙 데이터가 없으면 종료
    if(!region){
        console.log
        return;
    }


    // 선택한 대륙 이름으로 제목 변경
    mobileCountryTitle.textContent =
        `${region.regionName}에서 어디로 떠나볼까요?`;

    mobileCountryList.innerHTML = "";

    region.countries.forEach(function(country){

    

    });


    
    // 기존 버튼 삭제
    mobileCountryList.innerHTML = "";

    // 국가 버튼 생성
    region.countries.forEach(function(country){

        const button = document.createElement("button");

        button.classList.add("mobile_country_btn");

        button.textContent = country.country;


button.addEventListener("click", function(){

    projectDetailCard.classList.remove('active');

    // 모든 모바일 국가 버튼 active 제거
    document.querySelectorAll(".mobile_country_btn").forEach(function(otherButton){
        otherButton.classList.remove("active");
    });

    // 클릭한 버튼 active
    button.classList.add("active");


    // 안내문 숨기기
    countryGuide.style.display = "none";

    // 국가 카드 보이기
    countryCard.style.display = "block";


    // 국가명
    document.querySelector(".country_name").textContent =
        country.country;

    // 영문 국가명
    document.querySelector(".country_name_en").textContent =
        country.countryEn;

    // 도시
    document.querySelector(".country_city_name").textContent =
        country.card.cities.join(" · ");

    // 이미지
    document.querySelector(".country_card_img img").src =
        country.card.image;

  
    // 프로젝트 전체보기 링크
document.querySelector(".project_detail_all a").href =
    country.projectListLink || "#";

// 프로젝트 상세카드 국가명
document.querySelector(".project_detail_country").textContent =
    `${country.countryEn.toUpperCase()} · ${country.country}`;
    

// 모바일 상세카드 프로젝트 필터 생성


const projectFilterBox =
    document.querySelector(".project_filter_box");

// 기존 필터 삭제
projectFilterBox.innerHTML = "";

// 선택한 국가의 프로젝트 유형으로 필터 생성
country.card.projectTypes.forEach(function(type){

    const filter = document.createElement("button");

    filter.classList.add("project_filter");
    filter.dataset.type = type;
    filter.textContent = type;

    // 필터 클릭
    filter.addEventListener("click", function(){

        // 기존 active 제거
        document.querySelectorAll(".project_filter")
            .forEach(function(otherFilter){
                otherFilter.classList.remove("active");
            });

        // 선택한 필터 active
        filter.classList.add("active");

        // 해당 프로젝트 표시
        showProject(country.projects, type);

    });

    projectFilterBox.appendChild(filter);

});

    // 프로젝트 태그
    const projectTagBox =
        document.querySelector(".project_tag_box");

    projectTagBox.innerHTML = "";

country.card.projectTypes.forEach(function(type){

    const tag = document.createElement("div");

    tag.classList.add("project_tag", "text_14");
    tag.textContent = type;

    // 국가카드 태그 클릭
    tag.addEventListener("click", function(){

        if (!country.projects) {
            return;
        }

        // 상세카드 열기
        document
            .querySelector(".project_detail_card")
            .classList.add("active");

        // 해당 태그의 프로젝트 표시
        showProject(
            country.projects,
            type
        );

        // 상세카드 필터 active 맞추기
        document
            .querySelectorAll(".project_filter")
            .forEach(function(filter){

                filter.classList.toggle(
                    "active",
                    filter.dataset.type === type
                );

            });

    });

    projectTagBox.appendChild(tag);

});

});


const projectViewBtn = document.querySelector('.country_link_but');
const projectDetailCard = document.querySelector('.project_detail_card');

projectViewBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const selectedCountry =
        mapData.regions
            .flatMap(function (region) {
                return region.countries;
            })
            .find(function (country) {
                return country.country ===
                    document.querySelector(".country_name").textContent;
            });

    if (!selectedCountry || !selectedCountry.projects) {
        return;
    }

    // 상세카드 열기
    projectDetailCard.classList.add("active");

    // 첫 번째 프로젝트 표시
    const firstProject = selectedCountry.projects[0];

    showProject(
        selectedCountry.projects,
        firstProject.type
    );

    // 첫 번째 프로젝트에 맞춰 필터 active
    document.querySelectorAll(".project_filter").forEach(function (filter) {
        filter.classList.toggle(
            "active",
            filter.dataset.type === firstProject.type
        );
    });
});


// 프로젝트 상세카드 닫기


const projectDetailClose =
    document.querySelector(".project_detail_close");

projectDetailClose.addEventListener("click", function(){

    document
        .querySelector(".project_detail_card")
        .classList.remove("active");

});




    //  국가 버튼 클릭
    button.addEventListener("click", function(){

        console.log("선택한 국가:", country.country);

    });


        mobileCountryList.appendChild(button);

    });

   
    console.log("생성 완료:", mobileCountryList.children.length);


    setTimeout(function(){

        console.log(
            "1초 후 버튼 수:",
            document.querySelector(".mobile_country_list").children.length
        );

    }, 1000);

}



// ========================================
// 모바일 국가카드 스와이프
// ========================================

const countrySwipeCard =
    document.querySelector(".country_card");

let countryTouchStartX = 0;
let countryTouchStartY = 0;

countrySwipeCard.addEventListener("touchstart", function(e){

    if(window.innerWidth > 767) return;

    countryTouchStartX = e.changedTouches[0].clientX;
    countryTouchStartY = e.changedTouches[0].clientY;

}, { passive: true });


countrySwipeCard.addEventListener("touchend", function(e){

    // 모바일에서만 작동
    if(window.innerWidth > 767) return;

    // 국가카드가 보이지 않으면 종료
    if(countrySwipeCard.style.display === "none") return;

    const diffX =
        countryTouchStartX - e.changedTouches[0].clientX;

    const diffY =
        countryTouchStartY - e.changedTouches[0].clientY;

    // 짧은 터치 및 세로 스크롤 제외
    if(Math.abs(diffX) < 50) return;
    if(Math.abs(diffX) <= Math.abs(diffY)) return;

    // 현재 대륙에 표시된 국가 버튼
    const countryButtons = [
        ...document.querySelectorAll(".mobile_country_btn")
    ];

    if(countryButtons.length < 2) return;

    // 현재 선택된 국가
    const currentIndex = countryButtons.findIndex(
        button => button.classList.contains("active")
    );

    if(currentIndex === -1) return;

    // 왼쪽: 다음 국가 / 오른쪽: 이전 국가
    const direction = diffX > 0 ? 1 : -1;

    // 마지막 ↔ 첫 번째 순환
    const nextIndex =
        (currentIndex + direction + countryButtons.length)
        % countryButtons.length;

    // 기존 국가 선택 기능 실행
    countryButtons[nextIndex].click();

}, { passive: true });





// 모바일 프로젝트 카드 스와이프


const swipeCard = document.querySelector(".project_detail_card");

let touchStartX = 0;
let touchStartY = 0;

swipeCard.addEventListener("touchstart", function(e){

    if(window.innerWidth > 767) return;

    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;

}, { passive: true });


swipeCard.addEventListener("touchend", function(e){

    if(window.innerWidth > 767) return;
    if(!swipeCard.classList.contains("active")) return;

    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // 세로 스크롤은 무시
    if(Math.abs(diffX) < 50) return;
    if(Math.abs(diffX) <= Math.abs(diffY)) return;

    // 현재 선택한 국가 찾기
    const countryName =
        document.querySelector(".country_name").textContent;

    const selectedCountry = mapData.regions
        .flatMap(region => region.countries)
        .find(country => country.country === countryName);

    if(!selectedCountry || !selectedCountry.projects?.length) return;

    const projects = selectedCountry.projects;

    // 현재 활성화된 프로젝트 유형
    const activeFilter =
        document.querySelector(".project_filter.active");

    const currentIndex = activeFilter
        ? projects.findIndex(project =>
            project.type === activeFilter.dataset.type)
        : 0;

    const nextIndex = diffX > 0
        ? (currentIndex + 1) % projects.length
        : (currentIndex - 1 + projects.length) % projects.length;

    const nextProject = projects[nextIndex];

    // 프로젝트 내용 변경
    showProject(projects, nextProject.type);

    // 필터 active 동기화
    document.querySelectorAll(".project_filter").forEach(function(filter){

        filter.classList.toggle(
            "active",
            filter.dataset.type === nextProject.type
        );

    });

}, { passive: true });



const partnerBtn = document.querySelector(".partner_toggle_btn");
const partnerWrap = document.querySelector(".partner_logo_wrap");

partnerBtn.addEventListener("click", function(){

    const isOpen = partnerBtn.classList.toggle("active");

    if(isOpen){
        partnerWrap.style.height =
            partnerWrap.scrollHeight + "px";

        partnerBtn.querySelector("span:first-child").textContent = "접기";
    }else{
        partnerWrap.style.height = "45px";

        partnerBtn.querySelector("span:first-child").textContent = "펼치기";
    }

});


// 전화번호 팝업


const modal = document.getElementById('phoneModal');
const triggers = document.querySelectorAll('.phone_trigger');
const closeBtn = document.querySelector('.close_btn');
const copyBtn = document.querySelector('.copy_btn');
const phoneNumber = document.getElementById('phoneNumber');

// 아이콘 누르면 열기
triggers.forEach((trigger) => {

  trigger.addEventListener('click', (e) => {

    e.preventDefault();

    modal.classList.add('active');

  });

});


// 닫기 버튼
closeBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});


// 오버레이 클릭하면 닫기
modal.addEventListener('click', (e) => {

  if (e.target === modal) {
    modal.classList.remove('active');
  }

});


// 복사 버튼
copyBtn.addEventListener('click', () => {

  navigator.clipboard.writeText(phoneNumber.textContent)
    .then(() => {

      copyBtn.textContent = '복사됨!';

      setTimeout(() => {
        copyBtn.textContent = '복사';
      }, 1500);

    });

});




// 1:1 문의 팝업


const inquiryModal = document.getElementById('inquiryModal');
const inquiryTrigger = document.querySelector('.inquiry_trigger');
const inquiryCloseBtn = document.querySelector('.inquiry_close_btn');


// 열기
inquiryTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    inquiryModal.classList.add('active');
});


// 닫기
inquiryCloseBtn.addEventListener('click', () => {
    inquiryModal.classList.remove('active');
});


// 바깥 영역 클릭하면 닫기
inquiryModal.addEventListener('click', (e) => {

    if(e.target === inquiryModal){
        inquiryModal.classList.remove('active');
    }

});


const inquiryEmail = document.getElementById('inquiryEmail');
const inquiryContent = document.getElementById('inquiryContent');
const inquirySubmitBtn = document.querySelector('.inquiry_submit_btn');


function checkInquiryForm(){

    const emailValue = inquiryEmail.value.trim();
    const contentValue = inquiryContent.value.trim();

    if(emailValue !== '' && contentValue !== ''){
        inquirySubmitBtn.classList.add('active');
    }else{
        inquirySubmitBtn.classList.remove('active');
    }

}


inquiryEmail.addEventListener('input', checkInquiryForm);
inquiryContent.addEventListener('input', checkInquiryForm);


// 모바일 메뉴

const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const overlay = document.getElementById('overlay');
const body = document.body;

function openNav(){
    hamburger.classList.add('active');
    mobileNav.classList.add('active');
    overlay.classList.add('active');
    body.classList.add('nav_open');
}

function closeNav(){
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    body.classList.remove('nav_open');
}

hamburger.addEventListener('click', ()=>{
    mobileNav.classList.contains('active') ? closeNav() : openNav();
});


overlay.addEventListener('click', closeNav);
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeNav(); });


// 아코디언 (한 번에 하나만 열림)
document.querySelectorAll('.m_menu_head').forEach(head=>{
    head.addEventListener('click', ()=>{
        const item = head.parentElement;
        const sub = item.querySelector('.m_submenu');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.m_menu_item').forEach(i=>{
            i.classList.remove('open');
            i.querySelector('.m_submenu').style.maxHeight = null;
        });
        if(!isOpen){
            item.classList.add('open');
            sub.style.maxHeight = sub.scrollHeight + 'px';
        }
    });
});