const {form, colors} = require('../colorRoles.json'),
  botConfig = require('../config.json'),
  Command = require('../command.js');

class Color extends Command {
  constructor() {
    super('color');
  }

  async startCommand(componentInteraction) {
    if (componentInteraction) {
      if (this.intr.customId == 'kolor_ListButton') this.sendList(true);
      else if (this.intr.customId == 'kolor_DeleteButton') this.deleteUserColor(true);
      else if (this.intr.customId == 'kolor_Select') {
        const colorData = colors.find(c => c.value == this.intr.values[0]);
        this.setUserColor(colorData.name, true);
      }
    } else {
      if (this.opt.getSubcommandGroup(false) == 'admin' && 
       (this.opt.getSubcommand() == 'usuń' || this.opt.getSubcommand() == 'dodaj')) this.adminControl();
      else if (this.opt.getSubcommand() == 'zmiana' && !this.opt.get('kolor')) this.sendForm();
      else if (this.opt.getSubcommand() == 'zmiana' && this.opt.get('kolor')) {
        const colorData = colors.find(c => c.value == this.opt.get('kolor').value);
        this.setUserColor(colorData.name, false);
      }
      else if (this.opt.getSubcommand() == 'lista') this.sendList(false);
    }
  }

  async setUserColor(colorName, ephemeral) {
    if (!this.intr.deferred && !this.intr.replied) this.intr.deferReply({ ephemeral: true });
    await this.deleteUserColor(false);
    const roles = await this.intr.guild.roles.fetch();
    const roleToAssign = roles.find(r => r.name == botConfig.rolePrefix + colorName);
    await this.member.roles.add(roleToAssign);
    await this.intr.editReply({ embeds: [
      this.getEmbed(1, `Pomyślnie zmieniono kolor na <@&${roleToAssign.id}>`)
    ], ephemeral: ephemeral });
  }

  async deleteUserColor(sendReply) {
    if (sendReply & !this.intr.deferred && !this.intr.replied) this.intr.deferReply({ ephemeral: true });
    const user = await this.member.fetch();
    const userRoles = user.roles.cache;
    for (const role of userRoles) {
      if (role[1].name.startsWith(botConfig.rolePrefix)) await user.roles.remove(role[1].id);
    }
    if (sendReply) {
      await this.intr.editReply({ embeds: [
        this.getEmbed(1, 'Pomyślnie usunięto kolor nicku')
      ], ephemeral: true });
    }
  }

  async sendList(ephemeral) {
    await this.intr.reply({ files: ['src/colorList.png'], ephemeral: ephemeral });
  }

  async sendForm() {
    const f = form;
    f[0].components[0].options = colors.map(c => {
      return {
        label: c.name,
        value: c.value,
        emoji: c.emoji,
        description: c.value.toUpperCase()
      };
    });
    this.intr.reply({ components: f });
  }

  async adminControl() {
    await this.intr.deferReply({ ephemeral: true });

    if (!this.member.permissions.has('ADMINISTRATOR')) {
      await this.intr.editReply({ content: 'Nie jesteś adminem cwaniaczku', ephemeral: true });
      return;
    }

    if (this.opt.getSubcommand() == 'usuń') {
      const roles = await this.guild.roles.fetch();
      let i = 0;
      for (const role of roles) {
        if (role[1].name.startsWith(botConfig.rolePrefix)) {
          try {
            await role[1].delete();
            i++;
          } catch (e) {
            console.error(e);
            await this.intr.editReply({ content: e.toString(), ephemeral: true });
            return;
          }
        }
      }
      await this.intr.editReply({ content: `Usunięto ${i} ról`, ephemeral: true });
    } else if (this.opt.getSubcommand() == 'dodaj') {
      let i = 0;
      for (const color of colors) {
        try {
          await this.guild.roles.create({
            name: botConfig.rolePrefix + color.name,
            color: color.value
          });
          i++;
        } catch (e) {
          console.error(e);
          await this.intr.editReply({ content: e.toString(), ephemeral: true });
          return;
        }
      }
      await this.intr.editReply({ content: `Stworzono ${i} ról`, ephemeral: true });
    }
  }
}

const color = new Color();

module.exports = {
  admin: false,
  commandData: {
    name: 'kolor',
    description: 'Kolorowe nicki',
    options: [
      {
        name: 'lista',
        description: 'Lista wszystkich dostępnych kolorów',
        type: 1
      },
      {
        name: 'admin',
        description: 'Admin only',
        type: 2,
        options: [
          {
            name: 'dodaj',
            description: 'Dodaj kolorowe role do serwera',
            type: 1,
          },
          {
            name: 'usuń',
            description: 'Usuń kolorowe role z serwera',
            type: 1,
          }
        ]
      },
      {
        name: 'zmiana',
        description: 'Zmień kolor swojego nicku',
        type: 1,
        options: [
          {
            name: 'kolor',
            description: 'Wybierz kolor',
            type: 3,
            choices: colors
          }
        ]
      }
    ]
  },
  execute: color.execute.bind(color)
};