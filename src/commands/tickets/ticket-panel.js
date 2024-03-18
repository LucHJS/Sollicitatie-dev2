const { SelectMenuBuilder, ModalBuilder } = require('@discordjs/builders')
const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder, ChannelType, Embed, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, PermissionsBitField, TextInputBuilder, TextInputStyle } = require('discord.js')
const schema = require('../../models/TicketSetup')
const schema1 = require('../../models/ticket')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket-panel")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)

        .setDescription("Delete the whole ticket system "),

    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        
        const { guild } = interaction
        const data = await schema.findOne(
            { GuildId: guild.id }
        )
        const data1 = await schema1.findOne(
            { Guild: interaction.guild.id }
        )
        if(!data){
            interaction.reply("❌ | ticket system is not setted up")
        }
        const embed = new EmbedBuilder()
            .setColor(client.mainColor)
            .setDescription(data1.Description)
            .setTitle(data1.Title)
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.avatarURL()})
            .setAuthor({ name:  client.user.username,  iconURL: client.user.avatarURL() })

            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel('Create Ticket')
                    .setEmoji('🎫')
                    .setStyle(ButtonStyle.Primary)
            )

            interaction.reply({content: '✅ | Here is the panel', ephemeral: true})
            interaction.channel.send({embeds: [embed], components: [row]})

    }
}