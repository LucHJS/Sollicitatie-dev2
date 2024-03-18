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
        if (!interaction.isButton()) return

        if (interaction.customId === 'create_ticket') {
         
            const open = interaction.guild.channels.cache.find(channel => channel.id === data2.Channel)
           
            if (open) {
                return interaction.reply({ content: `❌ | You already have a channel open please close that one first to create a new ticket`, ephemeral: true })
            } else {
                const category = data.Category
                const category_id = interaction.guild.channels.cache.find(channel => channel.type == ChannelType.GuildCategory && channel.id == category)
                const role = data.Handlers


                interaction.guild.channels.create({
                    name: `Ticket-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    parent: category_id,
                    topic: `Ticket of ${interaction.user.name}, some details: \n User ID ${interaction.id}`,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                        },
                        {
                            id: role,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                        }
                    ]
                }).then(async (channel) => {

                    await data2.updateOne(
                        {
                            Guild: guild.id,
                            Channel: channel.id
                        }
                    )
                    const embed = new EmbedBuilder()
                        .setColor(client.mainColor)
                        .setDescription(data.Description)
                        .setTitle(`🎫 | ${interaction.guild.name} Ticket system`)
                        .setTimestamp()
                        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setAuthor({ name: interaction.guild.name, icon: interaction.guild.iconURL({ dynamic: true }) })


                    const row1 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('ticket-close')
                            .setLabel('Close ticket')
                            .setEmoji('🔐')
                            .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                            .setCustomId('ticket-claim')
                            .setLabel('claim ticket')
                            .setEmoji('🖐')
                            .setStyle(ButtonStyle.Primary)
                        )

                    await channel.send({ content: `${interaction.user}, <@&${role}>` })
                    await channel.send({ embeds: [embed], components: [row1] })
                    

                    const embed1 = new EmbedBuilder()
                        .setColor(client.mainColor)
                        .setDescription(`✅ | Successfully opened a ticket in ${channel} \nplease give a reason in the ticket!`)
                        .setTitle(`🎫 | ${interaction.guild.name} Ticket system`)
                        .setThumbnail(guild.iconURL())
                        .setTimestamp()
                        .setFooter({ text: interaction.guild.name, iconURL: guild.iconURL({ size: 1024 }) })
                        .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL({ size: 1024 }) })

                    interaction.reply({ embeds: [embed1], ephemeral: true })

                })
            }
        }


    },
};
