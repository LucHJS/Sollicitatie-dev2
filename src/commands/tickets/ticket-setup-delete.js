const { SelectMenuBuilder, ModalBuilder } = require('@discordjs/builders')
const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder, ChannelType, Embed, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, PermissionsBitField, TextInputBuilder, TextInputStyle } = require('discord.js')
const schema = require('../../models/TicketSetup')
const schema1 = require('../../models/ticket')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket-config-delete")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

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
            { Guild: guild.id }
        )
        
        await interaction.deferReply()
        if (!data) {
            interaction.editReply({ content: `❌ | You didn't set the ticket system so i cant delete anything`, ephemeral: true })
        } else {
            data.delete()
            data1.delete()
            interaction.editReply({ content: `✅ | Ticket system is deleted to set it up again use /ticket-setup`, ephemeral: true })
        }


    }
}