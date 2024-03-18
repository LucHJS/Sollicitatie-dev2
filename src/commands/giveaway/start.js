const { SelectMenuBuilder, ModalBuilder } = require('@discordjs/builders')
const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder, ChannelType, Embed, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, PermissionsBitField, TextInputBuilder, TextInputStyle } = require('discord.js')
const messages = require("../../events/utils/message");
const ms = require("ms")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("giveaway-start")
        .setDescription("change some things of the ticket system")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(
            string =>
                string.setName("duration").setDescription('How long the giveaway should last for. Example values: 1m, 1h, 1d')
                    .setRequired(true)
        ).addIntegerOption(
            t =>
                t.setName("winners")
                    .setDescription("How many winners the giveaway should have")
                    .setRequired(true)
        ).addStringOption(
            string =>
                string.setName("prize").setDescription('What the prize of the giveaway should be')
                    .setRequired(true)
        )
        .addChannelOption(
            string =>
                string.setName("channel").setDescription('The channel to start the giveaway in')
                    .setRequired(true)
        )
        .addRoleOption(
            string =>
                string.setName("bonusrole").setDescription('Role which would recieve bonus entries')
                    .setRequired(false)
        )
        .addIntegerOption(
            string =>
                string.setName("bonusamount").setDescription('The amount of bonus entries the role will recieve')
                    .setRequired(false)
        )
        .addStringOption(
            string =>
                string.setName("invite").setDescription('Invite of the server you want to add as giveaway joining requirement')
                    .setRequired(false)
        )
        .addRoleOption(
            string =>
                string.setName("role").setDescription('Role you want to add as giveaway joining requirement')
                    .setRequired(false)
        ),

    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({
                content: ':x: You need to have the manage messages permissions to start giveaways.',
                ephemeral: true
            });
        }

        const giveawayChannel = interaction.options.getChannel('channel');
        const giveawayDuration = interaction.options.getString('duration');
        const giveawayWinnerCount = interaction.options.getInteger('winners');
        const giveawayPrize = interaction.options.getString('prize');


        if (!giveawayChannel.isTextBased()) {
            return interaction.reply({
                content: ':x: Please select a text channel!',
                ephemeral: true
            });
        }

        if (isNaN(ms(giveawayDuration))) {
            return interaction.reply({
                content: ':x: Please select a valid duration!',
                ephemeral: true
            });
        }

        if (giveawayWinnerCount < 1) {
            return interaction.reply({
                content: ':x: Please select a valid winner count! greater or equal to one.',
            })
        }


        const bonusRole = interaction.options.getRole('bonusrole')
        const bonusEntries = interaction.options.getInteger('bonusamount')
        let rolereq = interaction.options.getRole('role')
        let invite = interaction.options.getString('invite')

        if (bonusRole) {
            if (!bonusEntries) {
                return interaction.reply({
                    content: `:x: You must specify how many bonus entries would ${bonusRole} recieve!`,
                    ephemeral: true
                });
            }
        }

        await interaction.deferReply({ ephemeral: true })


        let reqinvite;
        if (invite) {
          let invitex = await client.fetchInvite(invite)
          let client_is_in_server = client.guilds.cache.get(
            invitex.guild.id
          )
          reqinvite = invitex
          if (!client_is_in_server) {
            
              const gaEmbed = {
                author: {
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL() 
                },
                title: "Server Check!",
                description:
                  "Woah woah woah! I see a new server! are you sure I am in that? You need to invite me there to set that as a requirement! 😳",
                timestamp: new Date(),
                footer: {
                  iconURL: client.user.displayAvatarURL(),
                  text: "Server Check"
                }
              }  
            return interaction.editReply({ embeds: [gaEmbed]})
          }
        }

        if (rolereq && !invite) {
            messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> - Only members having ${rolereq} are allowed to participate in this giveaway!`
          }
          if (rolereq && invite) {
            messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> - Only members having ${rolereq} are allowed to participate in this giveaway!\n- Members are required to join [this server](${invite}) to participate in this giveaway!`
          }
          if (!rolereq && invite) {
            messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> - Members are required to join [this server](${invite}) to participate in this giveaway!`
          }

          client.giveawaysManager.start(giveawayChannel, {
            // The giveaway duration
            duration: ms(giveawayDuration),
            // The giveaway prize
            prize: giveawayPrize,
            // The giveaway winner count
            winnerCount: parseInt(giveawayWinnerCount),
            // Hosted by
            hostedBy: interaction.user,
            // BonusEntries If Provided
            bonusEntries: [
              {
                // Members who have the role which is assigned to "rolename" get the amount of bonus entries which are assigned to "BonusEntries"
                bonus: new Function('member', `return member.roles.cache.some((r) => r.name === \'${bonusRole ?.name}\') ? ${bonusEntries} : null`),
                cumulative: false
              }
            ],
            // Messages
            messages,
            extraData: {
              server: reqinvite == null ? "null" : reqinvite.guild.id,
              role: rolereq == null ? "null" : rolereq.id,
            }
          });


          interaction.editReply({
            content:
              `Giveaway started in ${giveawayChannel}!`,
            ephemeral: true
          })

          if (bonusRole) {
            let giveaway = new EmbedBuilder()
              .setAuthor({ name: `Bonus Entries Alert!` })
              .setDescription(
                `**${bonusRole}** Has **${bonusEntries}** Extra Entries in this giveaway!`
              )
              .setColor(client.mainColor)
              .setTimestamp();
            giveawayChannel.send({ embeds: [giveaway] });
          }
      


    }
}