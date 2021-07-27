const Discord = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const client = new Discord.Client();
const config = require("./config.json");
const prefix = "!";

client.on('ready', () => {
  console.log(`${client.user.tag}, 시스템 온라인!`);
  client.user.setActivity('유저 뒷조사', { type: 'STREAMING' })
});
/*----------------------------------------------------------*/
client.on('message', async (msg) => {
  if (msg.author.bot) return; // 봇이 쓴건 무시
  if (msg.channel.type == "dm") return; // 개인 메세지 무시
  if (!msg.content.startsWith(prefix)) return; // !가 없으면 무시

  let command = msg.content.split(prefix);
  command = command[1].split(":");

  console.log(command);
  /*-------------------------------------------------------*/
  if (command.toString() === '뭐야') {
    msg.reply('뭐쿠뽀, 모그리는 지금 뒷조사 하느라 바쁘다쿠뽀');
  }
  /*-------------------------------------------------------*/
  if (msg.content == "!도움말" || msg.content == "!help") {
    let HelpEmbed = new Discord.MessageEmbed()
      .setColor('#00ff9d')
      .setTitle('FFXIV Searching Bot 사용법 [글섭(일본섭)전용]')
      .setAuthor('Created By Austin Kim')
      .setThumbnail(url = "https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png")
      .addFields(
        { name: '!도움말 || !help', value: '도움말을 가져옵니다. 바로 이 창을 띄웁니다.' },
        { name: '!s:닉네임', value: '입력한 닉네임을 토대로 넓은 기준으로 검색합니다.\n(정확한 서버를 모르거나 기억하는 닉네임이 애매할때 사용 하면 좋습니다.)\nex) !s:Rosen Kranz' },
        { name: '!d:닉네임:서버', value: '로드스톤에서 이 닉네임에 대한 자세한 정보를 찾아옵니다.\nex) !d:Rosen Kranz:Pandaemonium' },
        { name: '!x:닉네임', value: '한섭 한정! 인벤 사사게에 닉네임을 검색해 옵니다.\nex) !x:빛의영자하나' },
        { name: '!f:자유부대명:서버', value: '해당 자유부대의 부대원들을 찾아줍니다.\nex) !f:Equilibrium:Phoenix' },
        { name: '!b:닉네임:서버', value: '해당 캐릭터의 친구리스트를 불러옵니다.(공개 설정이 되어있는 경우만)\nex) !b:Rosen Kranz:Pandaemonium' },
        { name: '**@@@@@@@@검색시 주의사항@@@@@@@@**', value:'**대문자 소문자 와 띄어쓰기 까지 정확히 입력해야 검색가능해쿠뽀!**\n**세미콜론; 이 아니고 콜론: 이야 쿠뽀!**'}
      )
      .setFooter('FFXIV Searching Bot', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
    msg.channel.send(HelpEmbed)
  }
  /*-------------------------------------------------------*/
  if (command[0] == "s" && command[1]) {
    try {
      msg.channel.send("로드스톤에서 해당 정보를 가져오는 중이야쿠뽀.\n정보를 가져오는데 수초가 걸릴 수 있으니 조금만 기다려 줘쿠뽀.");
      await loadingstuff(command, msg);
    } catch (error) {
      msg.channel.send(`오류가 생겼어쿠뽀! 개발자에게 문의해줘쿠뽀 : ${error}`);
    }
  }else if (command[0] == "s"){ //안적었을때
    msg.channel.send("검색하고 싶은 닉네임을 입력해줘쿠뽀! ex) !s:Rosen Kranz")
  }
  /*-------------------------------------------------------*/
  if (command[0] == "d" && command[1] && command[2]) {
    try {
      msg.channel.send("로드스톤에서 해당 정보를 가져오는 중이야쿠뽀.\n정보를 가져오는데 수초가 걸릴 수 있으니 조금만 기다려 줘쿠뽀.");
      await loadingstuffdetail(command, msg);
    } catch (error) {
      msg.channel.send(`오류가 생겼어쿠뽀! 개발자에게 문의해줘쿠뽀 : ${error}`);
    }
  }else if (command[0] == "d" && command[1]){ // 닉네임만 적었을때
    msg.channel.send("서버도 입력 해줘쿠뽀! ex)!d:Rosen Kranz:Pandaemonium")
  }else if (command[0] == "d"){ //둘다 안적었을때
    msg.channel.send("자세히 알고 싶은 닉네임이랑 서버를 같이입력해줘쿠뽀! ex)!d:Rosen Kranz:Pandaemonium")
  }
  /*-------------------------------------------------------*/
  if (command[0] == "x" && command[1]) {
    try {
      msg.channel.send("한섭 인벤 사사게에서 해당 정보를 가져오는 중이야쿠뽀.\n정보를 가져오는데 수초가 걸릴 수 있으니 조금만 기다려 줘쿠뽀.");
      await loadingsasage(command, msg);
    } catch (error) {
      msg.channel.send(`오류가 생겼어쿠뽀! 개발자에게 문의해줘쿠뽀 : ${error}`);
    }
  }else if (command[0] == "x"){ //안적었을때
    msg.channel.send("사사게에 검색하고 싶은 닉네임을 입력해줘쿠뽀! ex) !x:빛의영자하나")
  }
  /*-------------------------------------------------------*/
  if (command[0] == "f" && command[1] && command[2]) {
    try {
      msg.channel.send("로드스톤에서 해당 정보를 가져오는 중이야쿠뽀.\n정보를 가져오는데 수초가 걸릴 수 있으니 조금만 기다려 줘쿠뽀.");
      await loadingfreecompanymember(command, msg);
    } catch (error) {
      msg.channel.send(`오류가 생겼어쿠뽀! 개발자에게 문의해줘쿠뽀 : ${error}`);
    }
  }else if (command[0] == "f" && command[1]){ // 닉네임만 적었을때
    msg.channel.send("서버도 입력해줘쿠뽀! ex)!d:Rosen Kranz:Pandaemonium")
  }else if (command[0] == "f"){ //둘다 안적었을때
    msg.channel.send("알고 싶은 부대이름이랑 서버를 같이입력해줘쿠뽀! ex)!d:Rosen Kranz:Pandaemonium")
  }
  /*-------------------------------------------------------*/
  if (command[0] == "b" && command[1] && command[2]) {
    try {
      msg.channel.send("로드스톤에서 해당 정보를 가져오는 중이야쿠뽀.\n정보를 가져오는데 수초가 걸릴 수 있으니 조금만 기다려 줘쿠뽀.");
      await loadingfriendslist(command, msg);
    } catch (error) {
      msg.channel.send(`오류가 생겼어쿠뽀! 개발자에게 문의해줘쿠뽀 : ${error}`);
    }
  }else if (command[0] == "b" && command[1]){ // 닉네임만 적었을때
    msg.channel.send("서버도 입력 해줘쿠뽀! ex)!d:Rosen Kranz:Pandaemonium")
  }else if (command[0] == "b"){ //둘다 안적었을때
    msg.channel.send("친구들을 자세히 알고 싶은 닉네임이랑 서버를 같이입력해줘쿠뽀! ex)!d:Rosen Kranz:Pandaemonium")
  }
});
/*----------------------------------------------------------*/
const loadingstuff = async (command, msg) => {
  try {
    const responce = await axios.get(`https://xivapi.com/character/search?name=${command[1]}&private_key=${config.API_KEY}`);
    const obj = responce.data.Results;
    console.log('obj complete')

    searchinglist = [];
    for (let i = 0; i < obj.length; i++) {
      let something = obj[i].Name
      if (something == command[1]) {
        searchinglist.push(obj[i]);
      }
    }
    if (searchinglist.length == 0) {
      console.log('something have problem list is empty');
      msg.channel.send("검색 결과가 없어, 오타 및 대문자나 닉네임을 확인해줘");
      return;
    }
    for (let i = 0; i < searchinglist.length; i++) {
      const mname_temp = searchinglist[i].Name.split(' ');
      const mURL_Name = mname_temp[0] + '%20' + mname_temp[1];
      let where = searchinglist[i].Server;
      let why = where.split("("); // ["Pandaemonuim ", "Mana)"]
      let when = why[0].trim(); // "Pandaemonium" 앞 뒤 공백제거
      let LoadChar = new Discord.MessageEmbed()
        .setColor('#00ff9d')
        .setTitle(`${command[1]}에 대한 조사`)
        .setAuthor('로드스톤 공식 정보')
        .setThumbnail(`${searchinglist[i].Avatar}`)
        .addFields(
          { name: `${searchinglist[i].Name}`, value: `언어 = ${searchinglist[i].Lang}\n서버 = ${searchinglist[i].Server}` },
          { name: '로드스톤 프로필 링크(영어)', value:`https://na.finalfantasyxiv.com/lodestone/character/${searchinglist[i].ID}/`, inline:true},
          { name: 'FFLOG LINK (JP only)', value: `https://www.fflogs.com/character/jp/${when}/${mURL_Name}`, inline: true }
        )
        .setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
      msg.channel.send(LoadChar);
    }
    msg.channel.send(`검색끝쿠뽀!\n자세한 내용을 알고 싶으면\n !d:<name>:<server> 이런 방법으로 입력해쿠뽀!`)

  } catch (error) {
    if (error == "Error: Request failed with status code 404") {
      msg.channel.send(`검색 결과가 없어쿠뽀, 오타, 대문자, 서버 와 닉네임을 확인해줘쿠뽀`);
    }else if (error == "ReferenceError: searchinglist is not defined") {
      msg.channel.send("검색 결과가 없어쿠뽀, 오타, 대문자, 서버 와 닉네임을 확인해줘쿠뽀");
    }else {
    console.error(error);
    msg.channel.send(`오류가 생겼어쿠뽀! 개발자에게 문의해줘쿠뽀 : ${error}`);
    }
  }


}
/*----------------------------------------------------------*/
const loadingstuffdetail = async (command, msg) => {
  try {
    const responce = await axios.get(`https://xivapi.com/character/search?name=${command[1]}&private_key=${config.API_KEY}`);
    const obj = responce.data.Results;
    console.log('obj ready')
    for (let i = 0; i < obj.length; i++) {
      let something = obj[i].Name;
      let where = obj[i].Server;
      let why = where.split("("); // ["Pandaemonium ", "Mana)"]
      let when = why[0].trim(); // "Pandaemonium" 앞 뒤 공백제거
      if (something == command[1] && when == command[2]) {
        searchinglist = (obj[i]);
      }
    }
    if (searchinglist.length == 0) {
      console.log('something has problem list is empty');
      msg.channel.send("검색 결과가 없어쿠뽀, 오타, 대문자, 서버 와 닉네임을 확인해줘쿠뽀");
      return;
    }
    const IDresponce = await axios.get(`https://xivapi.com/character/${searchinglist.ID}?&private_key=${config.API_KEY}&data=AC,FR,FC,FCM,PVP`);
    const IDobj = IDresponce.data.Character
    const FCobj = IDresponce.data.FreeCompany
    const FCMobj = IDresponce.data.FreeCompanyMembers
    const FRobj = IDresponce.data.Friends
    const FRPublic = IDresponce.data.FriendsPublic
    const name_temp = IDobj.Name.split(' ');
    const URL_Name = name_temp[0] + '%20' + name_temp[1];
    const Fcn = IDobj.FreeCompanyName
    const Fct = FCobj.Tag
    if (Fcn == null) {
      Fcn = '부대없음';
      Fct = '';
    }
    let thisman = new Discord.MessageEmbed() //기본 정보 및 전투 클래스
      .setColor('#00ff9d')
      .setTitle(`${IDobj.Name} 기본 정보 및 전투 클래스`)
      .setAuthor('로드스톤 공식 정보')
      .setThumbnail(`${IDobj.Avatar}`)
      .setImage(`${IDobj.Portrait}`)
      .addFields(
        { name: '자유부대 이름', value: `${Fcn} [${Fct}]` },
        { name: '로드스톤 블로그', value: `https://na.finalfantasyxiv.com/lodestone/character/${IDobj.ID}/blog/` },
        { name: 'FFLOG LINK (JP only)', value: `https://www.fflogs.com/character/jp/${IDobj.Server}/${URL_Name}` },
        { name: `나이트/검술사`, value: `${IDobj.ClassJobs[0].Level}`, inline: true },
        { name: `전사/도끼술사`, value: `${IDobj.ClassJobs[1].Level}`, inline: true },
        { name: `암흑기사`, value: `${IDobj.ClassJobs[2].Level}`, inline: true },
        { name: `건브레이커`, value: `${IDobj.ClassJobs[3].Level}`, inline: true },
        { name: `몽크/격투가`, value: `${IDobj.ClassJobs[4].Level}`, inline: true },
        { name: `용기사/창술사`, value: `${IDobj.ClassJobs[5].Level}`, inline: true },
        { name: `닌자/쌍검사`, value: `${IDobj.ClassJobs[6].Level}`, inline: true },
        { name: `사무라이`, value: `${IDobj.ClassJobs[7].Level}`, inline: true },
        { name: `백마도사/환술사`, value: `${IDobj.ClassJobs[8].Level}`, inline: true },
        { name: `학자/비술사`, value: `${IDobj.ClassJobs[9].Level}`, inline: true },
        { name: `점성술사`, value: `${IDobj.ClassJobs[10].Level}`, inline: true },
        { name: `음유시인/궁술사`, value: `${IDobj.ClassJobs[11].Level}`, inline: true },
        { name: `기공사`, value: `${IDobj.ClassJobs[12].Level}`, inline: true },
        { name: `무도가`, value: `${IDobj.ClassJobs[13].Level}`, inline: true },
        { name: `흑마도사/주술사`, value: `${IDobj.ClassJobs[14].Level}`, inline: true },
        { name: `소환사/비술사`, value: `${IDobj.ClassJobs[15].Level}`, inline: true },
        { name: `적마도사`, value: `${IDobj.ClassJobs[16].Level}`, inline: true },
        { name: `청마도사`, value: `${IDobj.ClassJobs[17].Level}`, inline: true },
      )
      .setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
    msg.channel.send(thisman)
    const bozjan = IDobj.ClassJobsBozjan.Level;
    if (bozjan == null) {
      Ibozjan = "0";
    } else {
      Ibozjan = bozjan
    }
    let thisman2 = new Discord.MessageEmbed() // 채제작 클래스 및 보즈야 에우레카 레벨
      .setColor('#00ff9d')
      .setTitle(`${IDobj.Name} 제작/채집 클래스 및 기타 정보`)
      .setAuthor('로드스톤 공식 정보')
      .setThumbnail(`${IDobj.Avatar}`)
      .addFields(
        { name: '목수', value: `${IDobj.ClassJobs[18].Level}`, inline: true },
        { name: '대장장이', value: `${IDobj.ClassJobs[19].Level}`, inline: true },
        { name: '갑옷제작사', value: `${IDobj.ClassJobs[20].Level}`, inline: true },
        { name: '보석공예가', value: `${IDobj.ClassJobs[21].Level}`, inline: true },
        { name: '가죽공예가', value: `${IDobj.ClassJobs[22].Level}`, inline: true },
        { name: '재봉사', value: `${IDobj.ClassJobs[23].Level}`, inline: true },
        { name: '연금술사', value: `${IDobj.ClassJobs[24].Level}`, inline: true },
        { name: '요리사', value: `${IDobj.ClassJobs[25].Level}`, inline: true },
        { name: '광부', value: `${IDobj.ClassJobs[26].Level}`, inline: true },
        { name: '원예가', value: `${IDobj.ClassJobs[27].Level}`, inline: true },
        { name: '어부', value: `${IDobj.ClassJobs[28].Level}`, inline: true },
        { name: '보즈야 레벨', value: `${Ibozjan}`, inline: true },
        { name: '엘레멘탈 레벨', value: `${IDobj.ClassJobsElemental.Level}`, inline: true }
      )
      .setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
    msg.channel.send(thisman2)
    if (FCobj !== null) { // 소속한 부대가 있을 경우
      if (FCobj.Estate.Name !== null) { // 소속한 부대가 하우징이 있을경우
        let thisman3 = new Discord.MessageEmbed()
          .setColor('#00ff9d')
          .setTitle(`${IDobj.Name} 소속 부대 ${Fcn} 하우징 정보`)
          .setAuthor('로드스톤 공식 정보')
          .setThumbnail(url = "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/c5/c5253b7223d6842a8c0a1aec648ef13fc7a7d1de.png?n5.58")
          .addFields(
            { name: `부대집 이름 : ${FCobj.Estate.Name}`, value: `위치 : ${FCobj.Estate.Plot}` }
          )
        thisman3.setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
        msg.channel.send(thisman3)
      }
      if (FCMobj.length <= 5) {
        for (let i = 0; i < FCMobj.length; i++) {
          const mname_temp = FCMobj[i].Name.split(' ');
          const mURL_Name = mname_temp[0] + '%20' + mname_temp[1];
          const mID = FCMobj[i].ID;
          let member = new Discord.MessageEmbed()
            .setColor('#00ff9d')
            .setTitle(`${IDobj.Name} 가 소속한 ${Fcn}의 부대원`)
            .setAuthor('로드스톤 공식 정보')
            .setThumbnail(`${FCMobj[i].Avatar}`)
            .addFields(
              { name: FCMobj[i].Name, value: `계급 : ${FCMobj[i].Rank}\n로드스톤 캐릭터 정보 링크(영어) : https://na.finalfantasyxiv.com/lodestone/character/${mID}/`, inline: false },
              { name: '로드스톤 블로그 링크', value: `https://na.finalfantasyxiv.com/lodestone/character/${mID}/blog/`, inline: true },
              { name: 'FFLOG LINK (JP only)', value: `https://www.fflogs.com/character/jp/${IDobj.Server}/${mURL_Name}`, inline: true }
            )
            .setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
          msg.channel.send(member)
        }
      }
      if (FCMobj.length > 5) {
        for (let i = 0; i < 5; i++) {
          const mname_temp = FCMobj[i].Name.split(' ');
          const mURL_Name = mname_temp[0] + '%20' + mname_temp[1];
          const mID = FCMobj[i].ID;
          let member = new Discord.MessageEmbed()
            .setColor('#00ff9d')
            .setTitle(`${IDobj.Name} 가 소속한 ${Fcn}의 부대원`)
            .setAuthor('로드스톤 공식 정보')
            .setThumbnail(`${FCMobj[i].Avatar}`)
            .addFields(
              { name: FCMobj[i].Name, value: `계급 : ${FCMobj[i].Rank}\n로드스톤 캐릭터 정보 링크(영어) : https://na.finalfantasyxiv.com/lodestone/character/${mID}/`, inline: false },
              { name: '로드스톤 블로그 링크', value: `https://na.finalfantasyxiv.com/lodestone/character/${mID}/blog/`, inline: true },
              { name: 'FFLOG LINK (JP only)', value: `https://www.fflogs.com/character/jp/${IDobj.Server}/${mURL_Name}`, inline: true }
            )
            .setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
          msg.channel.send(member)
        }
        msg.channel.send(`해당 부대는 위의 인원보다 더 많은 부대원이 있어쿠뽀!\n더 알고 싶으면 !f:${FCobj.Name}:${FCobj.Server} 를 입력해봐쿠뽀!`);
      }
    }
    if (FRPublic == true) { // 친구리스트가 공개 설정 되었을 경우
      if (FRobj.length <= 5) {
        for (let i = 0; i < FRobj.length; i++) {
          const mname_temp = FRobj[i].Name.split(' ');
          const mURL_Name = mname_temp[0] + '%20' + mname_temp[1];
          let where = FRobj[i].Server;
          let why = where.split("("); // ["Pandaemonuim ", "Mana)"]
          let when = why[0].trim(); // "Pandaemonium" 앞 뒤 공백제거
          let friend = new Discord.MessageEmbed()
            .setColor('#00ff9d')
            .setTitle(`${IDobj.Name} 의 친구`)
            .setAuthor('로드스톤 공식 정보')
            .setThumbnail(`${FRobj[i].Avatar}`)
            .addFields(
              { name: FRobj[i].Name, value: `로드스톤 캐릭터 정보 링크(영어) : https://na.finalfantasyxiv.com/lodestone/character/${FRobj[i].ID}/` },
              { name: '로드스톤 블로그 링크', value: `https://na.finalfantasyxiv.com/lodestone/character/${FRobj[i].ID}/blog/`, inline: true },
              { name: 'FFLOG LINK (JP only)', value: `https://www.fflogs.com/character/jp/${when}/${mURL_Name}`, inline: true }
            )
            .setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
          msg.channel.send(friend)
        }
      }
      if (FRobj.length > 5) {
        for (let i = 0; i < 5; i++) {
          const mname_temp = FRobj[i].Name.split(' ');
          const mURL_Name = mname_temp[0] + '%20' + mname_temp[1];
          let where = FRobj[i].Server;
          let why = where.split("("); // ["Pandaemonuim ", "Mana)"]
          let when = why[0].trim(); // "Pandaemonium" 앞 뒤 공백제거
          let friend = new Discord.MessageEmbed()
            .setColor('#00ff9d')
            .setTitle(`${IDobj.Name} 의 친구`)
            .setAuthor('로드스톤 공식 정보')
            .setThumbnail(`${FRobj[i].Avatar}`)
            .addFields(
              { name: FRobj[i].Name, value: `로드스톤 캐릭터 정보 링크(영어) : https://na.finalfantasyxiv.com/lodestone/character/${FRobj[i].ID}/` },
              { name: '로드스톤 블로그 링크', value: `https://na.finalfantasyxiv.com/lodestone/character/${FRobj[i].ID}/blog/`, inline: true },
              { name: 'FFLOG LINK (JP only)', value: `https://www.fflogs.com/character/jp/${when}/${mURL_Name}`, inline: true }
            )
            .setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
          msg.channel.send(friend)
        }
        msg.channel.send(`해당 캐릭터는 친구가 엄청 많아쿠뽀! 위의 인원보다 더 있어쿠뽀!\n더 알고 싶으면 !b:${IDobj.Name}:${IDobj.Server} 를 입력해봐쿠뽀!`);
      }
    }
    else {
      msg.channel.send("이 친구는 친구리스트를 공개하지 않았어쿠뽀")
    }
    msg.channel.send(`해당 캐릭터에 대한 검색을 마쳤어 쿠뽀!`)
  } catch (error) {
    if (error == "Error: Request failed with status code 404") {
      msg.channel.send(`검색 결과가 없어쿠뽀, 오타, 대문자, 서버 와 닉네임을 확인해줘쿠뽀`);
    }else if (error == "ReferenceError: searchinglist is not defined") {
      msg.channel.send("검색 결과가 없어쿠뽀, 오타, 대문자, 서버 와 닉네임을 확인해줘쿠뽀");
    }else {
    console.error(error);
    msg.channel.send(`오류가 생겼어쿠뽀! 개발자에게 문의해줘쿠뽀 : ${error}`);
    }
  }
}
/*----------------------------------------------------------*/
const loadingsasage = async (command, msg) => {
  try {
    getHtml(command[1])
      .then(dataa => {
        let ulList = [];
        let filteredList = [];
        let $ = cheerio.load(dataa.data);
        const $article = $('div.board-list table tbody').children('tr')
        $article.each(function (i, elem) {
          ulList[i] = {
            url: $(this).find('td.tit div.text-wrap div a').attr('href'),
            text: $(this).find('td.tit div.text-wrap div a').text().trim(),
            from: $(this).find('td.user span').text()
          }
        })
        for (i = 0; i < ulList.length; i++) {
          let something = ulList[i].url;
          if (something !== undefined) {
            filteredList.push(ulList[i]);
          }
        }
        console.log(filteredList);
        if (filteredList.length == 0) {
          console.log('something have problem list is empty');
          msg.channel.send("검색 결과가 없어쿠뽀, 오타 및 대문자나 닉네임을 확인해줘쿠뽀");
          return;
        }
        for (let i = 1; i < filteredList.length; i++) {
          let sasageChar = new Discord.MessageEmbed()
            .setColor('#00ff9d')
            .setTitle(`${command[1]}에 대한 사사게 검색기록`)
            .setAuthor('한국 파판14 인벤 공식 정보')
            .setThumbnail('https://upload3.inven.co.kr/upload/2021/06/23/bbs/i21328909294.png')
            .addFields(
              {
                name: `작성자 : ${filteredList[i].from}`,
                value: `**서버 : ${filteredList[i].text}**
                    Link = ${filteredList[i].url}`
              },
            )
            .setFooter('한국 파판14 인벤 사건/사고 게시판', 'https://static.inven.co.kr/image_2011/webzine/logo/webzine_rn_logo_w.png')
          msg.channel.send(sasageChar);
        }

      });
  } catch (error) {
    console.error(error);
    msg.channel.send(`오류가 생겼어쿠뽀! 개발자에게 문의해줘쿠뽀 : ${error}`);
  }
}
/*----------------------------------------------------------*/
const loadingfreecompanymember = async (command, msg) => {
  try {
    const responce = await axios.get(`https://xivapi.com/freecompany/search?name=${command[1]}&server=${command[2]}&private_key=${config.API_KEY}`);
    const obj = responce.data.Results;
    console.log('obj ready')
    for (let i = 0; i < obj.length; i++) {
      let something = obj[i].Name;
      let where = obj[i].Server;
      if (command[1] == something && where == command[2]) {
        companylist = (obj[i]);
      }
    }
    if (companylist.length == 0) {
      console.log('something has problem list is empty');
      msg.channel.send("검색 결과가 없어쿠뽀, 오타, 대문자, 서버 와 닉네임을 확인해줘쿠뽀");
      return;
    }
    const IDresponce = await axios.get(`https://xivapi.com/freecompany/${companylist.ID}?&private_key=${config.API_KEY}&data=FCM`);
    const FCobj = IDresponce.data.FreeCompany
    const FCMobj = IDresponce.data.FreeCompanyMembers
    for (let i = 0; i < FCMobj.length; i++) {
      const mname_temp = FCMobj[i].Name.split(' ');
      const mURL_Name = mname_temp[0] + '%20' + mname_temp[1];
      let member = new Discord.MessageEmbed()
        .setColor('#00ff9d')
        .setTitle(`${FCobj.Name} 부대원 목록 ${i + 1}번째`)
        .setAuthor('로드스톤 공식 정보')
        .setThumbnail(`${FCMobj[i].Avatar}`)
        .addFields(
          { name: FCMobj[i].Name, value: `계급 : ${FCMobj[i].Rank}\n로드스톤 캐릭터 정보 링크(영어) : https://na.finalfantasyxiv.com/lodestone/character/${FCMobj[i].ID}/`, inline: false },
          { name: '로드스톤 블로그 링크', value: `https://na.finalfantasyxiv.com/lodestone/character/${FCMobj[i].ID}/blog/`, inline: true },
          { name: 'FFLOG LINK (JP only)', value: `https://www.fflogs.com/character/jp/${command[2]}/${mURL_Name}`, inline: true }
        )
        .setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
      msg.channel.send(member)
    }
    msg.channel.send(`이상 ${FCobj.Name} 부대원 목록이었어쿠뽀!`)
  }
  catch (error) {
    if (error == "Error: Request failed with status code 404") {
      msg.channel.send(`검색 결과가 없어쿠뽀, 오타, 대문자, 서버 와 닉네임을 확인해줘쿠뽀`);
    }else if (error == "ReferenceError: companylist is not defined") {
      msg.channel.send("검색 결과가 없어쿠뽀, 오타, 대문자, 서버 와 닉네임을 확인해줘쿠뽀");
    }else {
    console.error(error);
    msg.channel.send(`오류가 생겼어쿠뽀! 개발자에게 문의해줘쿠뽀 : ${error}`);
    }
  }
}
/*----------------------------------------------------------*/
const loadingfriendslist = async (command, msg) => {
  try {
    const responce = await axios.get(`https://xivapi.com/character/search?name=${command[1]}&private_key=${config.API_KEY}`);
    const obj = responce.data.Results;
    console.log('obj is ready')

    for (let i = 0; i < obj.length; i++) {
      let something = obj[i].Name;
      let where = obj[i].Server;
      let why = where.split("("); // ["Pandaemonuim ", "Mana)"]
      let when = why[0].trim(); // "Pandaemonium" 앞 뒤 공백제거
      if (something == command[1] && when == command[2]) {
        searchinglist = (obj[i]);
      }
    }
    if (searchinglist.length == 0) {
      console.log('something has problem list is empty');
      msg.channel.send("검색 결과가 없어쿠뽀, 오타, 대문자, 서버 와 닉네임을 확인해줘쿠뽀");
      return;
    }
    const IDresponce = await axios.get(`https://xivapi.com/character/${searchinglist.ID}?&private_key=${config.API_KEY}&data=AC,FR,FC,FCM,PVP`);
    const IDobj = IDresponce.data.Character
    const FRobj = IDresponce.data.Friends
    const FRPublic = IDresponce.data.FriendsPublic
    if (FRPublic == true) {
      for (let i = 0; i < FRobj.length; i++) {
        const mname_temp = FRobj[i].Name.split(' ');
        const mURL_Name = mname_temp[0] + '%20' + mname_temp[1];
        let where = FRobj[i].Server;
        let why = where.split("("); // ["Pandaemonuim ", "Mana)"]
        let when = why[0].trim(); // "Pandaemonium" 앞 뒤 공백제거
        let friend = new Discord.MessageEmbed()
          .setColor('#00ff9d')
          .setTitle(`${IDobj.Name} 친구목록 ${i + 1}번째`)
          .setAuthor('로드스톤 공식 정보')
          .setThumbnail(`${FRobj[i].Avatar}`)
          .addFields(
            { name: FRobj[i].Name, value: `로드스톤 캐릭터 정보 링크(영어) : https://na.finalfantasyxiv.com/lodestone/character/${FRobj[i].ID}/` },
            { name: '로드스톤 블로그 링크', value: `https://na.finalfantasyxiv.com/lodestone/character/${FRobj[i].ID}/blog/`, inline: true },
            { name: 'FFLOG LINK (JP only)', value: `https://www.fflogs.com/character/jp/${when}/${mURL_Name}`, inline: true }
          )
          .setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
        msg.channel.send(friend)
      }
      msg.channel.send(`이상 ${IDobj.Name}의 친구들을 모두 찾았어쿠뽀!`)
    }
    else {
      msg.channel.send("이 친구는 친구리스트를 공개하지 않았어쿠뽀")
    }
  } catch (error) {
    if (error == "Error: Request failed with status code 404") {
      msg.channel.send(`검색 결과가 없어쿠뽀, 오타, 대문자, 서버 와 닉네임을 확인해줘쿠뽀`);
    }else if (error == "ReferenceError: searchinglist is not defined") {
      msg.channel.send("검색 결과가 없어쿠뽀, 오타, 대문자, 서버 와 닉네임을 확인해줘쿠뽀");
    }else {
    console.error(error);
    msg.channel.send(`오류가 생겼어쿠뽀! 개발자에게 문의해줘쿠뽀 : ${error}`);
    }
  }
}
/*----------------------------------------------------------*/
const getHtml = async (key) => {
  try {
    let who = encodeURI(key);
    return await axios.get(`https://www.inven.co.kr/board/ff14/4485?keyword=${who}`);
  } catch (error) {
    msg.channel.send(`오류가 생겼어쿠뽀! 개발자에게 문의해줘쿠뽀 : ${error}`);
  }
}
/*----------------------------------------------------------*/
client.login(config.token);