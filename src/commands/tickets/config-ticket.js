const { SelectMenuBuilder, ModalBuilder } = require('@discordjs/builders')
const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder, ChannelType, Embed, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, PermissionsBitField, TextInputBuilder, TextInputStyle } = require('discord.js')
const schema = require('../../models/ticket')
const schema2 = require('../../models/TicketSetup')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket-open-embed")
        .setDescription("change some things of the ticket system")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(
            string =>
                string.setName("description").setDescription('Change the description of the panel embed')
                    .setRequired(true)
        ),


    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {

        const { guild } = interaction
        const data = await schema2.findOne(
            { GuildId: guild.id }
        )
      

        await interaction.deferReply()
        if (!data) {
            interaction.editReply({ content: `❌ | You didn't set the ticket system so i cant delete anything`, ephemeral: true })
        } else {
            const description = interaction.options.getString("description")

           await schema2.findOneAndUpdate({
                GuildId: interaction.guild.id,
                Description: description,
            })
           
            interaction.editReply(`✅ | Successfully changed the ticket panel use / panel to get the new panel in that channel`)
          
         
        }




    }
}