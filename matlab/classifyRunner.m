global mynet;
if isempty(mynet)
    disp("Chargement CNN...");
    mynet = coder.loadDeepLearningNetwork('fruitnet.mat', 'netTransfer');
end

% Création fichier started pour dire que le programme est démarré
fStart = fopen("started.status", 'w');
fclose(fStart);

while not(isfile("stop.command"))
    fprintf("En attente... %s\n",datestr(now));
    pause(0.5);
    
    % Création répertoire images si inexistant
    [status, msg] = mkdir('images');
    if not(status)
        disp(msg);
        return;
    end
    
    % Regarder la liste des fichiers dans images
    listing = dir('images');
    
    % filtrer les images au format .JPG
    for i = 1:size(listing)
        % vérifier que ce n'est pas un dossier
        if not(listing(i).isdir())
            % vérifier l'extension
            filename     = listing(i).name;
            filesplitext = split(filename,'.');
            fullfilename = strcat('images\',filename);
            
            if strcmpi(filesplitext{end},'jpg')
                % lancer analyse de l'image
                fprintf("Analyse %s...\n",filename);
                result = classifyImage(fullfilename);
                % supprimer l'image car elle ne sert plus à rien
                delete(fullfilename)
                
                % Création du répertoire result si inexistant
                [status, msg] = mkdir('result');
                if not(status)
                    disp(msg);
                    return;
                end
                
                % écriture du résultat dans un fichier texte portant le nom
                % de l'image
                resultFullfilename = strcat('result/',filename,'.txt');
                fprintf("Résultat stocké dans %s\n", resultFullfilename);
                fid = fopen(resultFullfilename, 'w');
                fprintf(fid,"%s",result);
                fclose(fid);
                
            end
        end
    end
end

% Le programme s'est arrêté
fprintf("Arrêt de l'analyse");
delete("started.status");
% nettoyer résultats
if isfolder("result")
    rmdir("result", 's');
end