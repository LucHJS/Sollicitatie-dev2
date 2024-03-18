const { SelectMenuBuilder, ModalBuilder } = require('@discordjs/builders')
const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder, ChannelType, Embed, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, PermissionsBitField, TextInputBuilder, TextInputStyle } = require('discord.js')
const schema = require('../../models/TicketSetup')

const schema2 = require('../../models/ticket')
const { createTranscript } = require('discord-html-transcripts');


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


        if (interaction.isStringSelectMenu()) {

            const LogChannel = interaction.guild.channels.cache.find(channel => channel.id = data.Transcript)
            const { values } = interaction;
            values.some(async (value) => {
                // make the transcript
                const transcriptFile = await createTranscript(interaction.channel, {
                    limit: -1,
                    fileName: `${interaction.channel.name}.html`,
                    returnBuffer: false
                });


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
                    .setColor(`${config.embedColor}`)
                    .setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ size: 1024 }) })
                    .setTimestamp();

                    await schema2.deleteOne(
                        {
                            Channel: interaction.channel.id
                        }
                    )    

                LogChannel.send({ embeds: [logEmbed] })
                LogChannel.send({ files: [transcriptFile] })

                setTimeout(function () {
                    interaction.channel.delete()
                }, 5000);
            })


        }


    },
};
