import { SlashCommandBuilder, PermissionFlagsBits, Role } from 'discord.js';
import { Command } from '../../types/Command';
import { successEmbed } from '../../utils/embeds';
import { GuildModel } from '../../services/cacheService';
const command: Command = {
  data: new SlashCommandBuilder().setName('autorole').setDescription('Add/remove auto-role on join')
    .addStringOption(o=>o.setName('action').setDescription('add or remove').setRequired(true).addChoices({ name:'add',value:'add' },{ name:'remove',value:'remove' }))
    .addRoleOption(o=>o.setName('role').setDescription('Role').setRequired(true)),
  userPermissions: [PermissionFlagsBits.ManageRoles],
  async execute(interaction) {
    const action=interaction.options.getString('action',true);
    const role=interaction.options.getRole('role',true) as Role;
    const update = action==='add' ? { $addToSet:{ autoRoles:role.id } } : { $pull:{ autoRoles:role.id } };
    await GuildModel.findOneAndUpdate({ guildId:interaction.guild!.id }, update, { upsert:true });
    await interaction.reply({ embeds:[successEmbed(`Auto-role **${role.name}** ${action==='add'?'added':'removed'}.`)] });
  },
};
export default command;
