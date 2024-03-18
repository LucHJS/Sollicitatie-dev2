const { SelectMenuBuilder, ModalBuilder } = require('@discordjs/builders')
const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder, ChannelType, Embed, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, PermissionsBitField, TextInputBuilder, TextInputStyle } = require('discord.js')
const schema = require('../../models/TicketSetup')
const schema2 = require('../../models/ticket')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket-setup")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription("Setup ticket system"),

    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild } = interaction
        const data = await schema.findOne(
            { GuildId: interaction.guild.id }
        )
        const data2 = await schema.findOne(
            { Guild: guild.id }
        )
     
        if (data) return interaction.reply('You already setted it up')


        //if (data) return interaction.reply({ embeds: [Data_is_al] })


        const modal = new ModalBuilder()
            .setCustomId('model')
            .setTitle('Setup Ticket')
            .addComponents(
                new ActionRowBuilder()
                    .addComponents([
                        new TextInputBuilder()
                            .setCustomId("des")
                            .setLabel("Embed Description")
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder("Place Ticket Embed Description Here ...")
                            .setRequired(true)]), new ActionRowBuilder()
                                .addComponents([
                                    new TextInputBuilder()
                                        .setCustomId("log")
                                        .setLabel("ticket log channel (NAME)")
                                        .setStyle(TextInputStyle.Short)
                                        .setPlaceholder("Please give a log channel name!")
                                        .setRequired(true)
                                ]), new ActionRowBuilder()
                                    .addComponents([
                                        new TextInputBuilder()
                                            .setCustomId("embed")
                                            .setLabel("embed channel (NAME)")
                                            .setStyle(TextInputStyle.Short)
                                            .setPlaceholder("Channel Where the opening embed comes!")
                                            .setRequired(true)
                                    ]), new ActionRowBuilder()
                                        .addComponents([
                                            new TextInputBuilder()
                                                .setCustomId("admin")
                                                .setLabel("admin role (NAME)")
                                                .setStyle(TextInputStyle.Short)
                                                .setPlaceholder("Give a name of a admin role")
                                                .setRequired(true)
                                        ]), new ActionRowBuilder()
                                            .addComponents([
                                                new TextInputBuilder()
                                                    .setCustomId("cat")
                                                    .setLabel("ticket category (NAME)")
                                                    .setStyle(TextInputStyle.Short)
                                                    .setPlaceholder("Give the name of a category")
                                                    .setRequired(true)
                                            ])

            )
        interaction.showModal(modal, {
            client: client,
            interaction: interaction,
        })

       

    }
}