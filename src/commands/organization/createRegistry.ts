import { CommandInteraction, GuildChannel, MessageEmbed, Permissions, TextChannel } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
	data: new SlashCommandBuilder()
		.setName('create_registry')
		.setDescription('Creates a registry to allow players to register for an upcoming event')
        .addStringOption(option => 
            option.setName('registry_name')
            .setDescription('Name of the registry')
            .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('A channel to put the registry in, this is where announcements will be made also')
            .setRequired(false)
            )
        .addRoleOption(option =>
            option.setName('role')
            .setDescription('This role will be used for pings when you create an event')
            .setRequired(false))
        .addStringOption(option =>
            option.setName('supported_game')
            .setDescription('This will create a registry for your game with one of our integrated games in the system')
            .addChoices([
                ['Europa Universalis IV','eu4'],
                ['Hearts of Iron IV', 'hoi4'],
                ['Stellaris', 'stellaris'],
                ['Civilization 5', 'civ5'],
                ['Civilization 6', 'civ6']
            ])
            .setRequired(false)),

	async execute(interaction: CommandInteraction) {
        const hasPermission = (permissions: string | Readonly<Permissions>, flag: bigint): boolean => {
            if (typeof permissions === 'string') {
                return false
            } else {
                return permissions.has(flag)
            }
          
        }

        if (interaction.channel?.type !== 'DM') {
            const embed = new MessageEmbed()
                .setColor('AQUA')
                .setTitle(`People currently registered for ${interaction.options.getString('registry_name')!}`)
                .setDescription('This is a registry board, you can use /register to show up here')
                .setFooter(`This registry was made by ${interaction.user.username}`, interaction.user.displayAvatarURL())

            let channel: any = interaction.options.getChannel('channel', false)!
        
            if (channel && channel.type === 'GUILD_TEXT') {
                channel as TextChannel
                await channel.send({embeds: [embed]})

                await interaction.reply(`Created a registry in the channel: ${channel.name}`)
            } else {
                channel = interaction.channel as TextChannel
                await channel.send({embeds: [embed]})

                await interaction.reply(`Created a registry in concurrent channel, channel selected wasn't a text channel`)
            }
        } else if (hasPermission(interaction.member!.permissions, Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply('Insufficient permissions')
        } else {
            await interaction.reply('This command isn\'t functional in dms')
        }
	},
};