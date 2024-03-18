const { SelectMenuBuilder, ModalBuilder } = require('@discordjs/builders')
const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder, ChannelType, StringSelectMenuBuilder, Embed, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, TextInputBuilder, TextInputStyle } = require('discord.js')
const schema = require('../../models/TicketSetup')

const schema2 = require('../../models/ticket')


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
        if (interaction.isModalSubmit()) {
             
            const description = interaction.fields.getTextInputValue("des")
   
            const log_channel = interaction.fields.getTextInputValue("log")

            const log_id = interaction.guild.channels.cache.find(channel => channel.name == log_channel)
            if (!log_id){
                return interaction.reply(`Thats not a name from a channel`)
            } 
     
            const embed_channel = interaction.fields.getTextInputValue("embed")

            const embed_id = interaction.guild.channels.cache.find(channel => channel.name == embed_channel)
            if (!embed_id){
                return interaction.reply(`Thats not a id from a channel`)
            } 
           

            const admin_role = interaction.fields.getTextInputValue("admin")

            const role = interaction.guild.roles.cache.find(role => role.name == admin_role)
            
            if (!role) {
                return interaction.reply("You didnt giveup a role")}

            const category = interaction.fields.getTextInputValue("cat")
            const category_id = interaction.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.name == category)

          
            if (!category_id){
                 return interaction.reply("you didn't giveup a category Name")
            }
           
            await schema.create({
                GuildId: interaction.guild.id,
                Channel: embed_id.id,
                Category: category_id.id,
                Transcript: log_id.id,
                Handlers: role.id,
                Description: description,
            })
            await schema2.create(
                {
                    Guild: guild.id,
                    Description: "Do you need help ?? we are here!! This channel is for making tickets and communicating with the admin team. To make a ticket, select your reason from the menu below to address your problem. For guidance, asking questions, reporting members, etc., you can open a ticket by Be in touch with the admin team. Also, after clicking the button below, select the reason for opening your ticket correctly, otherwise your ticket will not be processed. All tickets will be saved, so please stop opening tickets without any reason and in violation of server rules. Avoid tickets, otherwise you will be banned from making tickets",
                    Title: `🎫 | ${interaction.guild.name} Ticket System`,
                    Channel: null
                    }
            )

            if (interaction.customId === "model") {
                try {
                    const data2 = await schema.findOne({ Guild: interaction.guild.id })

                    const Logembed = new EmbedBuilder()
                        .setColor(client.mainColor)
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .addFields(
                            {
                                name: `\`📨 | Embed in Channel: \``,
                                value: `<#${embed_id.id}>`
                            },
                            {
                                name: '\`📃 | Log Channel:\`',
                                value: `<#${log_id.id}>`
                            },
                            {
                                name: '\`⚙ | Category:\`',
                                value: `<#${category_id.id}>`
                            },
                            {
                                name: '\`💼 | Admin Role:\`',
                                value: `<@&${role.id}>`
                            },
                            {
                                name: "\`🎫 | Embed Description\`",
                                value: `${description}`
                            }
                        )
                        .setFooter({ text: 'Ticket system is now setted up' })

                        .setTimestamp()
                        .setTitle("💻 | Ticket system successfully setted up")
                    interaction.reply({
                        embeds: [Logembed]
                    }).then(async (m) => {
                        const Ticket_embed = new EmbedBuilder()
                            .setColor(client.mainColor)
                            .setTitle(`🎫 | Ticket System`)
                            .setDescription('Do you need help ?? we are here!! This channel is for making tickets and communicating with the admin team. To make a ticket, select your reason from the menu below to address your problem. For guidance, asking questions, reporting members, etc., you can open a ticket by Be in touch with the admin team. Also, after clicking the button below, select the reason for opening your ticket correctly, otherwise your ticket will not be processed. All tickets will be saved, so please stop opening tickets without any reason and in violation of server rules. Avoid tickets')
                            .setTimestamp()
                            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setAuthor({ name: interaction.guild.name, icon: interaction.guild.iconURL({ dynamic: true }) })

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('create_ticket')
                                    .setLabel('Create Ticket')
                                    .setEmoji('🎫')
                                    .setStyle(ButtonStyle.Primary)
                            )

                        await embed_id.send({ embeds: [Ticket_embed], components: [row] })




                      
                    })
                } catch {
                    interaction.reply(`There is a error please wait / try it again `)
                }


            }
        }
      


    },
};
