const Discord = require('discord.js');
const request = require('request');
const axios = require('axios');
const client = new Discord.Client();
const config = require("./config.json");
const prefix = "!";

client.on('ready', () => {
    console.log(`${client.user.tag}, 시스템 온라인!`);
    client.user.setActivity('봇 만들기', { type: 'STREAMING' })
});

client.on('message', async(msg) => {
    if (msg.author.bot) return;
    if (msg.channel.type == "dm") return;
    if (!msg.content.startsWith(prefix)) return;

    let command = msg.content.split(prefix);
    command = command[1].split(":");

    console.log(command);

    if (command.toString() === '뭐야'){
        msg.reply('뭐요 나 지금 작동해요');
    }
    if(msg.content == "!도움말" || msg.content == "!help") {
        let HelpEmbed = new Discord.MessageEmbed()
          .setColor('#00ff9d')
          .setTitle('사용법')
          .setAuthor('Created By Austinia Kim')
          .addFields(
            { name: '!도움말', value: '도움말을 가져옵니다. 바로 이 창을 띄우는 거죠. 이제야 아셨나요?'},
            { name: '!s:이름 성 ex) !s:Rosen Kranz', value: '로드스톤에서 빠르게 이 사람을 뒷조사 해줍니다.'}
            )
        msg.channel.send(HelpEmbed)
      }
      if(command[0] == "s" && command[1]) {
          try {
            msg.channel.send("로드스톤에서 해당 정보를 가져오는 중이야.\n정보를 가져오는데 수초가 걸릴 수 있으니 조금만 기다려 줘.\n검색끝! 이라고 하기전까지 기다려 줘!");
            await loadingstuff(command, msg);
          } catch (error) {
            msg.channel.send("ㅈㅅ 오류남 콘솔보셈");
            console.error(error);
          }
      }
      if(command[0] == "s" && command[1] && command[2]) {
        try {
        //   msg.channel.send("로드스톤에서 해당 정보를 가져오는 중입니다.\n정보를 가져오는데 수초가 걸릴 수 있으니 조금만 기다려 주세요.");
        //   await loadingstuff(command, msg);
        msg.channel.send('미안 사실 아직 구현안했어 좀만 기다려줘~~');
        } catch (error) {
          msg.channel.send("ㅈㅅ 오류남 콘솔보셈");
          console.error(error);
        }
    }
});

const loadingstuff = async(command, msg) => {
    try {
        const responce = await axios.get(`https://xivapi.com/character/search?name=${command[1]}`);
        const obj = responce.data.Results;
        console.log('obj complete')

        searchinglist = [];
        for (let i = 0; i < obj.length; i++){
            let something = obj[i].Name
            if (something == command[1]){
                searchinglist.push(obj[i]);
            }
        }
        console.log('searchinglist :')
        console.log(searchinglist);
        if(searchinglist.length == 0){
            console.log('something have problem list is empty');
            msg.channel.send("검색 결과가 없어, 오타 및 대문자나 닉네임을 확인해줘");
            return;
        }


            for(let i =0; i < searchinglist.length; i++){
                let LoadChar = new Discord.MessageEmbed()
                .setColor('#00ff9d')
                .setTitle(`${command[1]}에 대한 조사`)
                .setAuthor('로드스톤 공식 정보')
                .setImage(`${searchinglist[i].Avatar}`)
                .addFields(
                    { name: `${searchinglist[i].Name}`, value: `언어 = ${searchinglist[i].Lang}\n서버 = ${searchinglist[i].Server}\nID = ${searchinglist[i].ID}`},
                    )
                msg.channel.send(LoadChar);
            }
            msg.channel.send(`검색끝!\n자세한 내용을 알고 싶으면\n !s:<name> <last name>:<ID> 를 입력해봐!`)

    } catch (error) {
        console.log(error);
    }
    
    
}
client.login(config.token);