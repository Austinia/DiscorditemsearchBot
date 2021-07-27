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
      .setTitle('사용법')
      .setAuthor('Created By Austin Kim')
      .addFields(
        { name: '!도움말', value: '도움말을 가져옵니다. 바로 이 창을 띄우는 거죠.' },
        { name: '!s:닉네임 ex) !s:Rosen Kranz', value: '로드스톤에서 빠르게 이 닉네임을 찾아줍니다.' },
        { name: '!d:닉네임:서버 ex) !d:Rosen Kranz:Pandaemonium', value: '로드스톤에서 이 사람에 대한 자세한 정보를 캐옵니다.' },
        { name: '!x:닉네임 ex) !x:빛의영자하나', value: '한섭 한정! 인벤 사사게에 닉네임을 검색해 옵니다.' }
      )
    msg.channel.send(HelpEmbed)
  }
  /*-------------------------------------------------------*/
  if (command[0] == "s" && command[1]) {
    try {
      msg.channel.send("로드스톤에서 해당 정보를 가져오는 중이야.\n정보를 가져오는데 수초가 걸릴 수 있으니 조금만 기다려 줘.\n검색끝! 이라고 하기전까지 기다려 줘!");
      await loadingstuff(command, msg);
    } catch (error) {
      msg.channel.send("ㅈㅅ 오류남 콘솔보셈");
      console.error(error);
    }
  }
  /*-------------------------------------------------------*/
  if (command[0] == "d" && command[1] && command[2]) {
    try {
      msg.channel.send("로드스톤에서 해당 정보를 가져오는 중이야.\n정보를 가져오는데 수초가 걸릴 수 있으니 조금만 기다려 줘.");
      await loadingstuffdetail(command, msg);
    } catch (error) {
      msg.channel.send("ㅈㅅ 오류남 콘솔보셈");
      console.error(error);
    }
  }
  /*-------------------------------------------------------*/
  if (command[0] == "x" && command[1]) {
    try {
      msg.channel.send("한섭 인벤 사사게에서 해당 정보를 가져오는 중이야.\n정보를 가져오는데 수초가 걸릴 수 있으니 조금만 기다려 줘.");
      const theList = await loadingsasage(command, msg);
    } catch (error) {
      console.error(error)
    }
  }
});
const loadingstuff = async (command, msg) => {
  try {
    const responce = await axios.get(`https://xivapi.com/character/search?name=${command[1]}`);
    const obj = responce.data.Results;
    console.log('obj complete')

    searchinglist = [];
    for (let i = 0; i < obj.length; i++) {
      let something = obj[i].Name
      if (something == command[1]) {
        searchinglist.push(obj[i]);
      }
    }
    console.log('searchinglist :')
    console.log(searchinglist);
    if (searchinglist.length == 0) {
      console.log('something have problem list is empty');
      msg.channel.send("검색 결과가 없어, 오타 및 대문자나 닉네임을 확인해줘");
      return;
    }


    for (let i = 0; i < searchinglist.length; i++) {
      let LoadChar = new Discord.MessageEmbed()
        .setColor('#00ff9d')
        .setTitle(`${command[1]}에 대한 조사`)
        .setAuthor('로드스톤 공식 정보')
        .setImage(`${searchinglist[i].Avatar}`)
        .addFields(
          { name: `${searchinglist[i].Name}`, value: `언어 = ${searchinglist[i].Lang}\n서버 = ${searchinglist[i].Server}\nID = ${searchinglist[i].ID}` },
        )
      msg.channel.send(LoadChar);
    }
    msg.channel.send(`검색끝!\n자세한 내용을 알고 싶으면\n !d:<name>:<server> 를 입력해봐!`)

  } catch (error) {
    console.log(error);
    msg.channel.send(`오류가 생겼어! 개발자에게 문의해줘 : 오류코드 ${error}`);
  }


}
/*----------------------------------------------------------*/
const loadingstuffdetail = async (command, msg) => {
  try {
    const responce = await axios.get(`https://xivapi.com/character/search?name=${command[1]}`);
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
      msg.channel.send("검색 결과가 없어, 오타, 대문자, 서버 와 닉네임을 확인해줘");
      return;
    }
    const IDresponce = await axios.get(`https://xivapi.com/character/${searchinglist.ID}?data=AC,FR,FC,FCM,PVP`);
    console.log(`https://xivapi.com/character/${searchinglist.ID}?data=AC,FR,FC,FCM,PVP`);
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
    let thisman = new Discord.MessageEmbed()
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
    let thisman2 = new Discord.MessageEmbed()
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
        { name: '보즈야 레벨', value: `${IDobj.ClassJobsBozjan.Level}`, inline: true },
        { name: '엘레멘탈 레벨', value: `${IDobj.ClassJobsElemental.Level}`, inline: true }
      )
      .setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
    msg.channel.send(thisman2)
    if (FCobj !== null) {
      if (FCobj.Estate.Name !== null) {
        let thisman3 = new Discord.MessageEmbed()
          .setColor('#00ff9d')
          .setTitle(`${IDobj.Name} 소속 부대 ${Fcn} 하우징 정보`)
          .setAuthor('로드스톤 공식 정보')
          .setThumbnail(url="https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/c5/c5253b7223d6842a8c0a1aec648ef13fc7a7d1de.png?n5.58")
          .addFields(
            { name: `부대집 이름 : ${FCobj.Estate.Name}`, value: `위치 : ${FCobj.Estate.Plot}` }
          )
        thisman3.setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
        msg.channel.send(thisman3)
      }
      if (FCMobj.length <= 5) {
        for (let i = 0; i < FCMobj.length; i++) {
          let member = new Discord.MessageEmbed()
            .setColor('#00ff9d')
            .setTitle(`${Fcn} 부대원`)
            .setAuthor('로드스톤 공식 정보')
            .setThumbnail(`${FCMobj[i].Avatar}`)
            .addFields(
              { name: FCMobj[i].Rank, value: `닉네임 : ${FCMobj[i].Name}\nID : ${FCMobj[i].ID}` }
            )
            .setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
          msg.channel.send(member)
        }
      }
      if (FCMobj.length > 5) {
        for (let i = 0; i < 5; i++) {
          let member = new Discord.MessageEmbed()
            .setColor('#00ff9d')
            .setTitle(`${IDobj.Name}가 소속한 ${Fcn}의 부대원`)
            .setAuthor('로드스톤 공식 정보')
            .setThumbnail(`${FCMobj[i].Avatar}`)
            .addFields(
              { name: FCMobj[i].Rank, value: `닉네임 : ${FCMobj[i].Name}\nID : ${FCMobj[i].ID}` }
            )
            .setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
          msg.channel.send(member)
        }
        msg.channel.send(`해당 부대는 위의 인원보다 더 많은 부대원이 있어쿠뽀!\n더 알고 싶으면 !f:${FCobj.ID} 를 입력해봐쿠뽀!`);
      }
    }
    if (FRPublic == true) {
      if (FRobj.length <= 5) {
        for (let i = 0; i < FRobj.length; i++) {
          let friend = new Discord.MessageEmbed()
            .setColor('#00ff9d')
            .setTitle(`${IDobj.Name} 친구`)
            .setAuthor('로드스톤 공식 정보')
            .setThumbnail(`${FRobj[i].Avatar}`)
            .addFields(
              { name: FRobj[i].Name, value: `ID : ${FRobj[i].ID}` }
            )
            .setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
          msg.channel.send(friend)
        }
      }
      if (FRobj.length > 5) {
        for (let i = 0; i < 5; i++) {
          let friend = new Discord.MessageEmbed()
            .setColor('#00ff9d')
            .setTitle(`${IDobj.Name} 친구`)
            .setAuthor('로드스톤 공식 정보')
            .setThumbnail(`${FRobj[i].Avatar}`)
            .addFields(
              { name: FRobj[i].Name, value: `ID : ${FRobj[i].ID}` }
            )
            .setFooter('로드스톤 API 정보', 'https://img.finalfantasyxiv.com/lds/h/9/_Huf58epDlt9vXiO8IIfPXxtXI.png')
          msg.channel.send(friend)
        }
        msg.channel.send(`해당 캐릭터는 친구가 엄청 많아쿠뽀! 위의 인원보다 더 있어쿠뽀!\n더 알고 싶으면 !b:${IDobj.Name} 를 입력해봐쿠뽀!`);
      }
    }
    else {
      msg.channel.send("이 친구는 친구리스트를 공개하지 않았어쿠뽀")
    }
  } catch (error) {
    if (error == "ReferenceError: searchinglist is not defined") {
      msg.channel.send("검색 결과가 없어쿠뽀, 오타, 대문자, 서버 와 닉네임을 확인해줘쿠뽀");
    }
    else {
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
            .addFields(
              {
                name: `작성자 : ${filteredList[i].from}`,
                value: `서버 : ${filteredList[i].text}
                    Link = ${filteredList[i].url}`
              },
            )
          msg.channel.send(sasageChar);
        }

      });
  } catch (error) {
    console.error(error);
    msg.channel.send(`오류가 생겼어쿠뽀! 개발자에게 문의해줘쿠뽀 : 오류코드 ${error}`);
  }
}
const getHtml = async (key) => {
  try {
    let who = encodeURI(key);
    return await axios.get(`https://www.inven.co.kr/board/ff14/4485?keyword=${who}`);
  } catch (error) {
    console.error(error);
  }
}
client.login(config.token);