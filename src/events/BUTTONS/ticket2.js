const { SelectMenuBuilder, ModalBuilder } = require('@discordjs/builders')
const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder, ChannelType, StringSelectMenuBuilder, Embed, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js')
const schema = require('../../models/TicketSetup')

const schema2 = require('../../models/ticket')
const discordTranscripts  = require('discord-html-transcripts');

module.exports = {
    name: "interactionCreate",
    rest: false,
    once: false,
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild } = interaction
        const data = await schema.findOne(
            { GuildId: interaction.guild.id }
        )



        const data2 = await schema2.findOne(
            { Guild: guild.id }
        )
        if (!interaction.isButton()) return

        if (interaction.customId === 'ticket-close') {
            const LogChannel = interaction.guild.channels.cache.get(data.Transcript)
            // make the transcript
            console.log(LogChannel.id)

            
        


            // send a succes message
            interaction.reply(`Ticket has been closed by <@${interaction.user.id}> and will close in 5 seconds!`)

            const user = interaction.channel.topic
            const us = interaction.guild.members.cache.get(user)


            // send the logs
            const logEmbed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL({ size: 1024 }) })
                .setTitle("🗑・Closed")
                .setDescription("A ticket has been closed!")
                .addFields(
                    {
                        name: `📃・Closed By:`,
                        value: `<@${interaction.user.id}>`
                    },
                    {
                        name: "❓・Channel",
                        value: `${interaction.channel.name}`
                    })
                .setColor(client.mainColor)
                .setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ size: 1024 }) })
                .setTimestamp();

                schema2.findOneAndUpdate({
                    Guild: interaction.guild.id,
                    Channel: null
                })
          

            LogChannel.send({ embeds: [logEmbed] })

            setTimeout(function () {
                interaction.channel.delete()
            }, 5000);

        }

        if (interaction.customId === 'ticket-claim') {
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply("I need perms")

            const embed_claim = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL({ size: 1024 }) })
                .setTitle('✋・Claimed')
                .setDescription(`You are now helped by: ${interaction.user}`)
                .setColor(client.mainColor)
                .setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ size: 1024 }) })
                .setTimestamp();

            interaction.deferUpdate()
            interaction.channel.send({ embeds: [embed_claim] })
        }


    },
};
